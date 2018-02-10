const BATCH_SIZE = 100

let jobNum = 0
let iterator // store iterator for current job
let VS // store light version of viewSettings obj for faster serialization

let renderStartTime, renderFinishTime

function spawnWorkers() {
  for (let i = 0; i < workerCount; i++) {
    workers[i] = new Worker('/src/mandelbrotWorker.js')
    workers[i].onmessage = finishJob
    console.log(`Worker ${i} spawned`)
  }
}

function startJob() {
  const { panX, panY, iterations, magnification } = viewSettings
  VS = { panX, panY, iterations, magnification }

  jobNum++
  renderStartTime = performance.now()

  let { width, height } = canvas
  iterator = spiralMaker(width, height)


  for (let i in workers) {
    const job = makeJob()
    job.workerId = i
    workers[i].postMessage(job)
  }
}

const fills = {
  rgb: count => `rgb(0,${Math.floor(count * 2.56)}, 0)`,
  red: count => `rgb(${Math.floor(count * 2.56)}, 0, 0)`,
  blue: count => `rgb(0, 0, ${Math.floor(count * 2.56)})`,
  green: count => `rgb(0,${Math.floor(count * 2.56)}, 0)`,
  hsl: count => `hsl(0, 100%, ${count}%)`
}

function finishJob(msg) {
  const job = msg.data
  if (job.jobNum !== jobNum) {
    console.log('old job')
    return
  }

  const { counts, workerId } = job
  for (let pixel of counts) {
    drawPixel(pixel)
  }


  const newJob = makeJob()

  if (newJob.pixels.length) {
    newJob.workerId = workerId
    workers[workerId].postMessage(newJob)
  } else {
    const renderFinishTime = performance.now()
    console.log(`render time for job ${jobNum}: ${renderFinishTime - renderStartTime}ms`)
  }
}

function drawPixel(pixel) {
  const { x, y, count } = pixel
  ctx.fill()
  ctx.fillStyle = fills[viewSettings.color](count)
  ctx.fillRect(x, y, 1, 1)
}

function* spiralMaker(w, h) {
  let x = 0,
      y = 0,
      dx = 0,
      dy = -1,
      maxI = Math.max(w*w, h*h)

  for(let i = 0; i < maxI; i++) {

    if (-w/2 <= x
        && x < w/2
        && -h/2 < y
        && y <= h/2
      ) {
          yield { x, y }
        }

    // handle corners
    if (
      x === y
      || (x < 0 && x === -y)
      || (x > 0 && x === 1 - y)
    ) {
      [dx, dy] = [-dy, dx]
    }

    x += dx
    y += dy
  }
}

function makeJob() {
  const pixels = []

  for (let i = 0; pixels.length < BATCH_SIZE; i++) {
    const pixel = iterator.next().value
    if (pixel) {
      const { x, y } = pixel
      pixel.currentX = (x / viewSettings.magnification) - viewSettings.panX
      pixel.currentY = (y / viewSettings.magnification) - viewSettings.panY
      pixels.push(pixel)
    }
  }

  return {
    jobNum,
    pixels,
    width,
    height,
    viewSettings
  }

}
