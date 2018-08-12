function checkPixel(x, y, iterations) {
  let real = x;
  let imaginary = y;

  for (let i = 0; i < iterations; i++) {
    // Calculate the real and imaginary components of the result separately
    const tempReal = real**2 - imaginary**2 + x;
    const tempImaginary =  2 * real * imaginary + y;
    real = tempReal;
    imaginary = tempImaginary;

    if (real * imaginary > 2) {
      const output = i / iterations * 100;
      return output;
    }
  }
  return 0;
}

function checkJob(job) {
  const {
    pixels,
    viewSettings: { iterations },
  } = job

  return pixels.map(({ x, y, currentX, currentY }) => ({
    x,
    y,
    currentX,
    currentY,
    count: checkPixel(currentX, currentY, iterations)
  }))
}

onmessage = (msg) => {
  const job = msg.data
  const { workerId, jobNum } = job

  const counts = checkJob(job)

   postMessage({
      workerId,
      jobNum,
      counts
   });
}
