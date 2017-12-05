const width = 800 //window.innerWidth;
const height = 500 //window.innerHeight;

// let iterations = 200
let shouldRender = false;


// Set up canvas, get refs to html
const canvas = document.createElement('canvas');
canvas.width = width;
canvas.height = height;
document.getElementById('canvas').appendChild(canvas);
const ctx = canvas.getContext('2d');
const iterationInput = document.getElementById('iterations');
const magnificationInput = document.getElementById('magnification');
// const panXInput = document.getElementById('panX');
// const panYInput = document.getElementById('panY');


// Check whether a pair of coordinates belongs to the Mandelbrot set
function checkSet(x, y) {
  const { iterations } = viewSettings
  let real = x;
  let imaginary = y;

  for (let i = 0; i < iterations; i++) {
    // Calculate the real and imaginary components of the result separately
    const tempReal = real**2 - imaginary**2 + x;
    const tempImaginary =  2 * real * imaginary + y;
    real = tempReal;
    imaginary = tempImaginary;

    if (real * imaginary > 5) {
      // return i
      const output = i / iterations * 100;
      // mandelbrotSet[x + ',' + y] = output;
      return output;
    }
  }
  // mandelbrotSet[x + ',' + y] = 0
  // return iterations;
  return 0;
}

// View settings

let viewSettings = {
  panSpeed: 50,
  zoomFactor: .1,
  magnification: 150,
  panX: 0,
  panY: 0,
  iterations: 200
}

// Draw
function draw() {
  isRendering = true
  let { magnification, panX, panY, iterations } = viewSettings
  let { width, height } = canvas
  const start = performance.now();


  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const currentX = ((x - width / 2) / magnification) - panX
      const currentY = ((y - height / 2) / magnification) - panY
      const belongsToSet = checkSet(currentX, currentY);
      // const [r, g, b] = rgbNum(belongsToSet)
      // ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillStyle =`hsl(0, 100%, ${belongsToSet}%)`
      ctx.fillRect(x, y, 1, 1);
    }
  }

  const stop = performance.now();
  console.log(`render time: ${stop - start}ms`)

  // Set settings pannel
  iterationInput.value = iterations;
  magnificationInput.value = magnification;

  isRendering = false
}

function setDPI(canvas, dpi) {
  // Set up CSS size.
  canvas.style.width = canvas.style.width || canvas.width + 'px';
  canvas.style.height = canvas.style.height || canvas.height + 'px';

  // Resize canvas and scale future draws.
  var scaleFactor = dpi / 96;
  canvas.width = Math.ceil(canvas.width * scaleFactor);
  canvas.height = Math.ceil(canvas.height * scaleFactor);
  var ctx = canvas.getContext('2d');
  ctx.scale(scaleFactor, scaleFactor);
}

function zoomIn() {
  viewSettings.magnification *= (1 + viewSettings.zoomFactor);
  // draw();
}

function zoomOut() {
  viewSettings.magnification *= (1 - viewSettings.zoomFactor);
  // draw();
}

let keyDownTimeout
function handleKeyDown(e) {
  const { magnification, zoomFactor, panSpeed } = viewSettings
  // console.log(e.key)
  switch(e.key) {
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

  if (shouldRender && !isRendering) {
    // isRendering = true
    shouldRender = false
    clearTimeout(keyDownTimeout)
    keyDownTimeout = setTimeout(draw, 300)
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

function handleAnimateClick () {
  canvas.classList.toggle('animate')
  document.getElementById('canvas').classList.toggle('animate2')
}

// setDPI(canvas, 96 * 4)
draw()

window.addEventListener('keydown', handleKeyDown)
document.getElementById('settingsForm').addEventListener('submit', setSettings);

document.getElementById('animate-button').addEventListener('click', handleAnimateClick)
document.getElementById('save-view').addEventListener('click', saveView)
document.getElementById('load-view').addEventListener('click', loadView)
document.getElementById('capture-view').addEventListener('click', captureView)
