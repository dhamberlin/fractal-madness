let width = window.innerWidth;
let height = window.innerHeight;
// const width = 600 * 3 // window.innerWidth;
// const height = 480 * 2 // window.innerHeight;
const workerCount = 3

let workers = []
let running = false

let isRendering = false

// View settings

let viewSettings = {
  panSpeed: 30,
  zoomFactor: .2,
  magnification: width / 4, //450,
  panX: .5,
  panY: 0,
  iterations: 60,
  color: 'red',
  resolutionFactor: 1
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
  stopPropagationAndPreventDefault(e)
  viewSettings.magnification *= (1 + viewSettings.zoomFactor);
  draw();
}

function zoomOut(e) {
  stopPropagationAndPreventDefault(e)
  viewSettings.magnification *= (1 - viewSettings.zoomFactor);
  draw();
}

function panLeft (e) {
  stopPropagationAndPreventDefault(e)
  viewSettings.panX += viewSettings.panSpeed / viewSettings.magnification
  draw()
}

function panRight (e) {
  stopPropagationAndPreventDefault(e)
  viewSettings.panX -= viewSettings.panSpeed / viewSettings.magnification
  draw()
}

function panUp (e) {
  stopPropagationAndPreventDefault(e)
  viewSettings.panY += viewSettings.panSpeed / viewSettings.magnification
  draw()
}

function panDown (e) {
  stopPropagationAndPreventDefault(e)
  viewSettings.panY -= viewSettings.panSpeed / viewSettings.magnification
  draw()
}

function handleKeyDown(e) {
  if (e.key === 'Escape') {
    UI.toggleSettingsPanel()
  }
  if (UI.state.isSettingsPanelOpen) {
    return
  }
  const { magnification, zoomFactor, panSpeed } = viewSettings
  switch (e.key) {
    case 'ArrowRight':
    case 'd':
      panRight(e)
      break;
    case 'ArrowLeft':
    case 'a':
      panLeft()
      break;
    case 'ArrowUp':
    case 'w':
      panUp()
      break;
    case 'ArrowDown':
    case 's':
      panDown()
      break;
    case ',':
    case '-':
      zoomOut()
      break;
    case '.':
    case '=':
      zoomIn()
      break;
    default:
      break;
  }
}

function setSettings(e) {

  viewSettings.iterations = iterationInput.value
  viewSettings.color = document.querySelector('.color-select').value

  UI.toggleSettingsPanel()
  const oldRes = viewSettings.resolutionFactor
  const newRes = document.getElementById('resolutionInput').checked ? 2 : 1
  if (oldRes !== newRes) {
    viewSettings.magnification *= newRes / oldRes
    viewSettings.resolutionFactor = newRes
    handleResize()
  } else {
    draw()
  }
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
  imgsrc = canvas.toDataURL()
  img.style.width = width
  img.style.height = height
  document.body.appendChild(img)

}

function handleAnimateClick() {
  canvas.classList.toggle('animate')
  document.getElementById('canvas').classList.toggle('animate2')
}

function stopPropagationAndPreventDefault(e) {
  if (e) {
    e.stopPropagation()
    e.preventDefault()
  }
}

function handleResize() {
  // document.getElementById('setSettings').innerHTML = ([
  //   `window.innerHeight: ${window.innerHeight}`,
  //   'screen.height: ' + screen.height,
  //   'screen.width: ' + screen.width,
  //   'window.outerHeight: ' + window.outerHeight
  // ].join('<br>'))
  const { resolutionFactor } = viewSettings
  const heightDiff = window.innerHeight - (height / resolutionFactor)
  if (heightDiff > 0 || heightDiff < -100) {
    width = window.innerWidth * resolutionFactor
    height = window.innerHeight * resolutionFactor
    canvas.width = width
    canvas.height = height
    ctx.translate(width / 2, height / 2)
    draw()
  }
}

function getHeight() {
  // TODO get innerHeight for desktop, screen height for mobile
}

function decreaseIterations(e) {
  stopPropagationAndPreventDefault(e)
  iterationInput.value = Math.floor(iterationInput.value * 0.8)
}

function increaseIterations(e) {
  stopPropagationAndPreventDefault(e)
  iterationInput.value = Math.floor(iterationInput.value * 1.2)
}

UI.init()
spawnWorkers()
draw()
