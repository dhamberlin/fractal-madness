function compute(y,xmin,dx,columns,maxIterations) {
   iterationCounts = [];
   for (let i = 0; i < columns; i++) {
      var x0 = xmin + i * dx;
      var y0 = y;
      var a = x0;
      var b = y0;
      var ct = 0;
      while (a*a + b*b < 4.1) {
         ct++;
         if (ct > maxIterations) {
            ct = -1;
            break;
         }
         var newa = a*a - b*b + x0;
         b = 2*a*b + y0;
         a = newa;
      }
      iterationCounts[i] = ct;
   }
   return iterationCounts;
}

function checkPixel(x, y, iterations) {
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

function checkRow(row, width, height, viewSettings) {
  const { magnification, panX, panY, iterations } = viewSettings
  const counts = []

  for (let i = 0; i < width; i++) {
    const x = ((row - width / 2) / magnification) - panX
    const y = ((i - height / 2) / magnification) - panY
    counts.push(checkPixel(x, y, iterations))
  }
  return counts
}

onmessage = (msg) => {
   const {
     row,
     width,
     height,
     viewSettings,
     workerId,
     jobNum
   } = msg.data;

   counts = checkRow(row, width, height, viewSettings);
   postMessage({
      workerId,
      jobNum,
      row,
      counts
   });
}
