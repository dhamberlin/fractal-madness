let width = window.innerWidth * 2;
let height = window.innerHeight * 2;
// const width = 600 * 3 // window.innerWidth;
// const height = 480 * 2 // window.innerHeight;
const workerCount = 3

let workers = []
let running = false
let jobNum = 0
let jobs = []
let jobsFinished

let isRendering = false

// View settings

let viewSettings = {
  panSpeed: 30,
  zoomFactor: .2,
  magnification: width / 4, //450,
  panX: .5,
  panY: 0,
  iterations: 60
}

let shouldRender = false;
let renderStart, renderFinish


// Set up canvas, get refs to html
const canvas = document.createElement('canvas');
canvas.width = width;
canvas.height = height;
document.getElementById('canvas').appendChild(canvas);
const ctx = canvas.getContext('2d');
ctx.translate(width / 2, height / 2)

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

function zoomIn(e) {
  e.stopPropagation()
  viewSettings.magnification *= (1 + viewSettings.zoomFactor);
  draw();
}

function zoomOut(e) {
  e.stopPropagation()
  viewSettings.magnification *= (1 - viewSettings.zoomFactor);
  draw();
}

function panLeft (e) {
  e.stopPropagation()
  e.preventDefault()
  viewSettings.panX += viewSettings.panSpeed / viewSettings.magnification
  draw()
}

function panRight (e) {
  e.stopPropagation()
  e.preventDefault()
  viewSettings.panX -= viewSettings.panSpeed / viewSettings.magnification
  draw()
}

function panUp (e) {
  e.stopPropagation()
  e.preventDefault()
  viewSettings.panY += viewSettings.panSpeed / viewSettings.magnification
  draw()
}

function panDown (e) {
  e.stopPropagation()
  e.preventDefault()
  viewSettings.panY -= viewSettings.panSpeed / viewSettings.magnification
  draw()
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
  canvas.webkitRequestFullscreen()

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

function handleResize() {
  console.log('resize')
  width = window.innerWidth * 2
  height = window.innerHeight * 2
  canvas.width = width
  canvas.height = height
  ctx.translate(width / 2, height / 2)
  draw()
}

// setDPI(canvas, 96 * 4)
spawnWorkers()
draw()

window.addEventListener('keydown', handleKeyDown)
document.getElementById('settingsForm').addEventListener('submit', setSettings);

document.getElementById('animate-button').addEventListener('click', handleAnimateClick)
document.getElementById('save-view').addEventListener('click', saveView)
document.getElementById('load-view').addEventListener('click', loadView)
document.getElementById('capture-view').addEventListener('click', captureView)

document.querySelector('.zoom-in').addEventListener('click', zoomIn)
document.querySelector('.zoom-out').addEventListener('click', zoomOut)
document.querySelector('.pan-left').addEventListener('click', panLeft)
document.querySelector('.pan-right').addEventListener('click', panRight)
document.querySelector('.pan-up').addEventListener('click', panUp)
document.querySelector('.pan-down').addEventListener('click', panDown)
window.addEventListener('resize', handleResize)
