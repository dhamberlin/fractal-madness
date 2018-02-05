const BATCH_SIZE = 100

let jobNum = 0
let jobs = []
let jobsFinished


function spawnWorkers() {
  for (let i = 0; i < workerCount; i++) {
    workers[i] = new Worker('mandelbrotWorker.js')
    workers[i].onmessage = finishJob
    console.log(`Worker ${i} spawned`)
  }
}

jobMaker = {
  fromCenter: () => {
    let { width, height } = canvas
    for (let i = 0; i < width / 2; i++) {
      let row = i
      jobs.push({
        jobNum,
        row,
        width,
        height,
        viewSettings,
      })
      row = width - 1 - i
      jobs.push({
        jobNum,
        row,
        width,
        height,
        viewSettings,
      })
    }
  },
}

let iterator

let pixelCache = {
  last: {},
  current: {}
}
function startJob() {
  if (running) stopJob()
  pixelCache.last = pixelCache.current
  pixelCache.current = {}
  jobNum++
  renderStart = performance.now()

  let { width, height } = canvas
  iterator = spiralMaker(width, height)

  for (let i in workers) {
    const job = makeJob()
    job.workerId = i
    workers[i].postMessage(job)
  }
}

function stopJob() {
  console.log('NO BRAKES!')
  jobs = []
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
  if (job.jobNum !== jobNum) return

  const { counts, workerId } = job
  for (let i in counts) {
    const { x, y, count } = counts[i]
    ctx.fill()
    ctx.fillStyle = fills.blue(count)
    ctx.fillRect(x, y, 1, 1)
  }

  const newJob = makeJob()

  if (newJob.pixels.length) {
    newJob.workerId = workerId
    workers[workerId].postMessage(newJob)
  } else {
    // renderStart = performance.now()
    // ctx.drawImage(hiddenCanvas, 0, 0)
    isRendering = false
    renderFinish = performance.now()
    renderTimeDisplay.innerHTML = `renderTime: ${renderFinish - renderStart}`
  }
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

  for (let i = 0; i < BATCH_SIZE; i++) {
    const pixel = iterator.next().value
    if (pixel) {
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
