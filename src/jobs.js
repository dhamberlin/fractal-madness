function spawnWorkers() {
  for (let i = 0; i < workerCount; i++) {
    workers[i] = new Worker('mandelbrotWorker.js')
    workers[i].onmessage = finishJob
    console.log(`Worker ${i} spawned`)
  }
}

jobMaker = {
  pixels: [],
  setSpiral: () => {
    // if (pixels.length) {

    // }

  },

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

  spiral: () => {
    let { width, height } = canvas
    let pixels = []

    let xmin = 0
    let xmax = width - 1
    let ymin = 0
    let ymax = height - 1
    let x = 0;
    let y = 0;

    const push = () => {
      pixels.push({ x, y })
    }

    while ((xmin < xmax) && (ymin < ymax)) {

      // go west
      while (x < xmax) {
        push()
        x++
      }
      ymin++

      // go south
      while (y < ymax) {
        push()
        y++
      }
      xmax--

      // go east
      while (x > xmin) {
        push()
        x--
      }
      ymax--

      // go north
      while (y > ymin) {
        push()
        y--
      }
      xmin++
    }
    console.log(pixels.length, 'pixels')
    let pixelIdx = 0
    while (pixelIdx < pixels.length) {

      let jobPixels = []
      for (let i = 0; i < 300 && pixelIdx < pixels.length; i++) {
        jobPixels.push(pixels[pixelIdx])
        pixelIdx++
      }

      const job = {
        jobNum,
        pixels: jobPixels,
        width,
        height,
        viewSettings,
      }
      jobs.push(job)

    }
  }

}

function startJob() {
  if (running) stopJob()
  jobNum++
  renderStart = performance.now()

  let { width, height } = canvas

  jobMaker.spiral()
  console.log('Time to spiral: ', performance.now() - renderStart)

  for (let i in workers) {
    const job = jobs.pop()
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
  jobsFinished++
  const job = msg.data
  if (job.jobNum !== jobNum) return

  const { counts, workerId } = job
  for (let i in counts) {
    const { x, y, count } = counts[i]
    ctx.fill()
    ctx.fillStyle = fills.blue(count)
    ctx.fillRect(x, y, 1, 1)
  }

  if (jobs.length) {
    const newJob = jobs.pop()
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