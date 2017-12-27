const width = window.innerWidth;
const height = window.innerHeight;
// const width = 600 // window.innerWidth;
// const height = 480 // window.innerHeight;
const workerCount = 8

let workers = []
let running = false
let jobNum = 0
let jobs = []
let jobsFinished

let isRendering = false

// View settings

let viewSettings = {
  panSpeed: 30,
  zoomFactor: .1,
  magnification: 150,
  panX: 0,
  panY: 0,
  iterations: 200
}

let shouldRender = false;
let renderStart, renderFinish


// Set up canvas, get refs to html
const canvas = document.createElement('canvas');
canvas.width = width;
canvas.height = height;
document.getElementById('canvas').appendChild(canvas);
const ctx = canvas.getContext('2d');
const iterationInput = document.getElementById('iterations');
const magnificationInput = document.getElementById('magnification');
const renderTimeDisplay = document.getElementById('renderTimeDisplay')

function draw() {
  startJob()

  // Set settings pannel
  let { magnification, panX, panY, iterations } = viewSettings
  iterationInput.value = iterations;
  magnificationInput.value = magnification;
}

function zoomIn() {
  viewSettings.magnification *= (1 + viewSettings.zoomFactor);
  // draw();
}

function zoomOut() {
  viewSettings.magnification *= (1 - viewSettings.zoomFactor);
  // draw();
}


let keyDownTimeout = false
function handleKeyDown(e) {
  const { magnification, zoomFactor, panSpeed } = viewSettings
  // console.log(e.key)
  switch (e.key) {
    case 'ArrowRight':
    case 'd':
      viewSettings.panX -= panSpeed / magnification;
      shouldRender = true
      break;
    case 'ArrowLeft':
    case 'a':
      viewSettings.panX += panSpeed / magnification;
      shouldRender = true
      break;
    case 'ArrowUp':
    case 'w':
      viewSettings.panY += panSpeed / magnification;
      shouldRender = true
      break;
    case 'ArrowDown':
    case 's':
      viewSettings.panY -= panSpeed / magnification;
      shouldRender = true
      break;
    case ',':
    case '-':
      viewSettings.magnification = magnification * (1 - zoomFactor);
      shouldRender = true
      break;
    case '.':
    case '=':
      viewSettings.magnification = magnification * (1 + zoomFactor);
      shouldRender = true
      break;
    default:
      break;
  }

  if (keyDownTimeout) return
  if (shouldRender) {
    keyDownTimeout = true
    shouldRender = false
    draw()
    setTimeout(() => {
      keyDownTimeout = false
    }, 100)
  }
}

function setSettings(e) {
  // e.preventDefault()
  viewSettings.iterations = iterationInput.value
  draw()
}

function saveView() {
  window.localStorage.viewSettings = JSON.stringify(viewSettings)
  console.log('Saved view:')
  console.log(window.localStorage.viewSettings)
}

function loadView() {
  viewSettings = JSON.parse(window.localStorage.viewSettings)
  console.log('Loaded view: ')
  console.log(viewSettings)
  draw()
}

function captureView() {
  const img = document.createElement('img')
  // img.width = width /4
  // img.height = height /4
  img.src = canvas.toDataURL()
  img.style.width = width
  img.style.height = height
  document.body.appendChild(img)

}

function handleAnimateClick() {
  canvas.classList.toggle('animate')
  document.getElementById('canvas').classList.toggle('animate2')
}

// setDPI(canvas, 96 * 4)
spawnWorkers()
// draw()
// jobMaker.setSpiral()

window.addEventListener('keydown', handleKeyDown)
document.getElementById('settingsForm').addEventListener('submit', setSettings);

document.getElementById('animate-button').addEventListener('click', handleAnimateClick)
document.getElementById('save-view').addEventListener('click', saveView)
document.getElementById('load-view').addEventListener('click', loadView)
document.getElementById('capture-view').addEventListener('click', captureView)
