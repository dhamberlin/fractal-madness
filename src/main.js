let width = window.innerWidth;
let height = window.innerHeight;
const workerCount = 3

let workers = []

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

// Set up canvas, get refs to html
const canvas = document.querySelector('#canvas');
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext('2d');
ctx.translate(width / 2, height / 2)

const iterationInput = document.getElementById('iterations');

function draw() {
  startJob()

  // Set settings pannel
  let { magnification, panX, panY, iterations } = viewSettings
  iterationInput.value = iterations;
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
  const { resolutionFactor } = viewSettings
  // Only resize for significant change to prevent rerender when
  // mobile browser UI changes window.innerHeight
  const hDiff = window.innerHeight - (height / resolutionFactor)
  const wDiff = window.innerWidth - (width / resolutionFactor)
  const shouldResize = hDiff > 0 || hDiff < -100 || wDiff > 0 || wDiff < -100
  if (shouldResize) {
    width = window.innerWidth * resolutionFactor
    height = window.innerHeight * resolutionFactor
    canvas.width = width
    canvas.height = height
    ctx.translate(width / 2, height / 2)
    draw()
  }
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
