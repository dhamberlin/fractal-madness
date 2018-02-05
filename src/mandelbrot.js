// const width = window.innerWidth;
// const height = window.innerHeight;
// // const width = 600 // window.innerWidth;
// // const height = 480 // window.innerHeight;
// const workerCount = 8

// let workers = []
// let running = false
// let jobNum = 0
// let jobs = []
// let jobsFinished

// let isRendering = false

// // View settings

// let viewSettings = {
//   panSpeed: 30,
//   zoomFactor: .1,
//   magnification: 150,
//   panX: 0,
//   panY: 0,
//   iterations: 200
// }

// let shouldRender = false;
// let renderStart, renderFinish

// // Set up canvas, get refs to html
// const canvas = document.createElement('canvas');
// canvas.width = width;
// canvas.height = height;
// document.getElementById('canvas').appendChild(canvas);
// const ctx = canvas.getContext('2d');

// const hiddenCanvas = document.createElement('canvas');
// hiddenCanvas.width = width;
// hiddenCanvas.height = height;
// const hctx = hiddenCanvas.getContext('2d');

// const iterationInput = document.getElementById('iterations');
// const magnificationInput = document.getElementById('magnification');
// const renderTimeDisplay = document.getElementById('renderTimeDisplay')

// function spawnWorkers() {
//   for (let i = 0; i < workerCount; i++) {
//     workers[i] = new Worker('mandelbrotWorker.js')
//     workers[i].onmessage = finishJob
//     console.log(`Worker ${i} spawned`)
//   }
// }

// jobMaker = {
//   pixels: [],
//   setSpiral: () => {
//     // if (pixels.length) {

//     // }

//   },

//   fromCenter: () => {
//     let { width, height } = canvas
//     for (let i = 0; i < width / 2; i++) {
//       let row = i
//       jobs.push({
//         jobNum,
//         row,
//         width,
//         height,
//         viewSettings,
//       })
//       row = width - 1 - i
//       jobs.push({
//         jobNum,
//         row,
//         width,
//         height,
//         viewSettings,
//       })
//     }
//   },

//   spiral: () => {
//     let { width, height } = canvas
//     let pixels = []

//     let xmin = 0
//     let xmax = width - 1
//     let ymin = 0
//     let ymax = height - 1
//     let x = 0;
//     let y = 0;

//     const push = () => {
//       pixels.push({ x, y })
//     }

//     while ((xmin < xmax) && (ymin < ymax)) {

//       // go west
//       while (x < xmax) {
//         push()
//         x++
//       }
//       ymin++

//       // go south
//       while (y < ymax) {
//         push()
//         y++
//       }
//       xmax--

//       // go east
//       while (x > xmin) {
//         push()
//         x--
//       }
//       ymax--

//       // go north
//       while (y > ymin) {
//         push()
//         y--
//       }
//       xmin++
//     }
//     console.log(pixels.length, 'pixels')
//     let pixelIdx = 0
//     while (pixelIdx < pixels.length) {

//       let jobPixels = []
//       for (let i = 0; i < 300 && pixelIdx < pixels.length; i++) {
//         jobPixels.push(pixels[pixelIdx])
//         pixelIdx++
//       }

//       const job = {
//         jobNum,
//         pixels: jobPixels,
//         width,
//         height,
//         viewSettings,
//       }
//       jobs.push(job)

//     }
//   }

// }

// function startJob() {
//   if (running) stopJob()
//   jobNum++
//   renderStart = performance.now()

//   let { width, height } = canvas

//   jobMaker.spiral()
//   console.log('Time to spiral: ', performance.now() - renderStart)

//   for (let i in workers) {
//     const job = jobs.pop()
//     job.workerId = i
//     workers[i].postMessage(job)
//   }
// }

// function stopJob() {
//   console.log('NO BRAKES!')
//   jobs = []
// }

// const fills = {
//   rgb: count => `rgb(0,${Math.floor(count * 2.56)}, 0)`,
//   red: count => `rgb(${Math.floor(count * 2.56)}, 0, 0)`,
//   blue: count => `rgb(0, 0, ${Math.floor(count * 2.56)})`,
//   green: count => `rgb(0,${Math.floor(count * 2.56)}, 0)`,
//   hsl: count => `hsl(0, 100%, ${count}%)`
// }

// function finishJob(msg) {
//   jobsFinished++
//   const job = msg.data
//   if (job.jobNum !== jobNum) return

//   const { counts, workerId } = job
//   for (let i in counts) {
//     const { x, y, count } = counts[i]
//     ctx.fill()
//     ctx.fillStyle = fills.blue(count)
//     ctx.fillRect(x, y, 1, 1)
//   }

//   if (jobs.length) {
//     const newJob = jobs.pop()
//     newJob.workerId = workerId
//     workers[workerId].postMessage(newJob)
//   } else {
//     // renderStart = performance.now()
//     // ctx.drawImage(hiddenCanvas, 0, 0)
//     isRendering = false
//     renderFinish = performance.now()
//     renderTimeDisplay.innerHTML = `renderTime: ${renderFinish - renderStart}`
//   }
// }

// Draw
// function draw() {
//   startJob()
  
//   // Set settings pannel
//   let { magnification, panX, panY, iterations } = viewSettings
//   iterationInput.value = iterations;
//   magnificationInput.value = magnification;
// }

// function zoomIn() {
//   viewSettings.magnification *= (1 + viewSettings.zoomFactor);
//   // draw();
// }

// function zoomOut() {
//   viewSettings.magnification *= (1 - viewSettings.zoomFactor);
//   // draw();
// }


// let keyDownTimeout = false
// function handleKeyDown(e) {
//   const { magnification, zoomFactor, panSpeed } = viewSettings
//   // console.log(e.key)
//   switch(e.key) {
//     case 'ArrowRight':
//     case 'd':
//       viewSettings.panX -= panSpeed / magnification;
//       shouldRender = true
//       break;
//     case 'ArrowLeft':
//     case 'a':
//       viewSettings.panX += panSpeed / magnification;
//       shouldRender = true
//       break;
//     case 'ArrowUp':
//     case 'w':
//       viewSettings.panY += panSpeed / magnification;
//       shouldRender = true
//       break;
//     case 'ArrowDown':
//     case 's':
//       viewSettings.panY -= panSpeed / magnification;
//       shouldRender = true
//       break;
//     case ',':
//     case '-':
//       viewSettings.magnification = magnification * (1 - zoomFactor);
//       shouldRender = true
//       break;
//     case '.':
//     case '=':
//       viewSettings.magnification = magnification * (1 + zoomFactor);
//       shouldRender = true
//       break;
//     default:
//       break;
//   }

//   if (keyDownTimeout) return
//   if (shouldRender) {
//     keyDownTimeout = true
//     shouldRender = false
//     draw()
//     setTimeout (() => {
//       keyDownTimeout = false
//     }, 100)
//   }
// }

// function setSettings(e) {
//   // e.preventDefault()
//   viewSettings.iterations = iterationInput.value
//   draw()
// }

// function saveView() {
//   window.localStorage.viewSettings = JSON.stringify(viewSettings)
//   console.log('Saved view:')
//   console.log(window.localStorage.viewSettings)
// }

// function loadView() {
//   viewSettings = JSON.parse(window.localStorage.viewSettings)
//   console.log('Loaded view: ')
//   console.log(viewSettings)
//   draw()
// }

// function captureView() {
//   const img = document.createElement('img')
//   // img.width = width /4
//   // img.height = height /4
//   img.fractal-madness/src = canvas.toDataURL()
//   img.style.width = width
//   img.style.height = height
//   document.body.appendChild(img)

// }

// function handleAnimateClick () {
//   canvas.classList.toggle('animate')
//   document.getElementById('canvas').classList.toggle('animate2')
// }

// // setDPI(canvas, 96 * 4)
// spawnWorkers()
// // draw()
// // jobMaker.setSpiral()

// window.addEventListener('keydown', handleKeyDown)
// document.getElementById('settingsForm').addEventListener('submit', setSettings);

// document.getElementById('animate-button').addEventListener('click', handleAnimateClick)
// document.getElementById('save-view').addEventListener('click', saveView)
// document.getElementById('load-view').addEventListener('click', loadView)
// document.getElementById('capture-view').addEventListener('click', captureView)
