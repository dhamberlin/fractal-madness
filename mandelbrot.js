const width = 500 //window.innerWidth;
const height = 400 //window.innerHeight;

let iterations = 120


const viewSettings = {
  panSpeed: 80,
  zoomFactor: .1,
  magnification: 150,
  panX: 2,
  panY: 1.5,
}

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

// const mandelbrotSet = {};

// Check whether a pair of coordinates belongs to the Mandelbrot set
function checkSet(x, y) {
  // const cachedValue = mandelbrotSet[x+','+y];
  // if (cachedValue !== undefined) return cachedValue;
  let real = x;
  let imaginary = y;

  for (let i = 0; i < iterations; i++) {
    // Calculate the real and imaginary components of the result separately
    const tempReal = real**2 - imaginary**2 + x;
    const tempImaginary =  2 * real * imaginary + y;
    real = tempReal;
    imaginary = tempImaginary;

    if (real * imaginary > 5) {
      return i
      // const output = i / iterations * 100;
      // mandelbrotSet[x + ',' + y] = output;
      // return output;
    }
  }
  // mandelbrotSet[x + ',' + y] = 0
  return iterations;
}

// View settings

const panSpeed = 80;
const zoomFactor = .1;
let magnification = 150;
let panX = 2;
let panY = 1.5;


// Draw
function draw() {
  console.log(iterations)
  const start = performance.now();


  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const belongsToSet = checkSet(x / magnification - panX,
                                    y / magnification - panY);
      const [r, g, b] = rgbNum(belongsToSet)
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      // ctx.fillStyle =`hsl(0, 100%, ${belongsToSet}%)`
      ctx.fillRect(x, y, 1, 1);
    }
  }

    const stop = performance.now();
    console.log(`render time: ${stop - start}ms`)

    // Set settings pannel
    iterationInput.value = iterations;
    magnificationInput.value = magnification;
    // panXInput.value = panX;
    // panYInput.value = panY;
}

draw()

function zoomIn() {
  magnification = magnification * (1 + zoomFactor);
  // draw();
}

function zoomOut() {
  magnification = magnification * (1 - zoomFactor);
  // draw();
}

let drawCooldown = false;
function handleKeyDown(e) {
  let shouldRender = true;
  // console.log(e.key)
  switch(e.key) {
    case 'ArrowRight':
    case 'd':
      panX -= panSpeed / magnification;
      break;
    case 'ArrowLeft':
    case 'a':
      panX += panSpeed / magnification;
      break;
    case 'ArrowUp':
    case 'w':
      panY += panSpeed / magnification;
      break;
    case 'ArrowDown':
    case 's':
      panY -= panSpeed / magnification;
      break;
    case ',':
    case '-':
      magnification = magnification * (1 - zoomFactor);
      break;
    case '.':
    case '=':
      magnification = magnification * (1 + zoomFactor);
      break;
    default:
      shouldRender = false;
      break;
  }
  if (shouldRender && !drawCooldown) {
    drawCooldown = true;
    setTimeout(() => {
      drawCooldown = false;
      draw()
    }, 300)
  }
}

function setSettings(e) {
  console.log('yo')
  // e.preventDefault()
  iterations = iterationInput.value
  draw()
}

window.addEventListener('keydown', handleKeyDown)
document.getElementById('settingsForm').addEventListener('submit', setSettings);
