const utils = {
  setDPI: (canvas, dpi) => {
    // Set up CSS size.
    canvas.style.width = canvas.style.width || canvas.width + 'px';
    canvas.style.height = canvas.style.height || canvas.height + 'px';

    // Resize canvas and scale future draws.
    var scaleFactor = dpi / 96;
    canvas.width = Math.ceil(canvas.width * scaleFactor);
    canvas.height = Math.ceil(canvas.height * scaleFactor);
    var ctx = canvas.getContext('2d');
    ctx.scale(scaleFactor, scaleFactor);
  },

  toggleUI: () => {
    const icons = Array.from(document.querySelectorAll('.ui-wrap .icon'))
    if (icons[0].classList.contains('fade-in')) {
      icons.forEach(i => i.classList.replace('fade-in', 'fade-out'))
    } else {
      icons.forEach(i => i.classList.replace('fade-out', 'fade-in'))
    }
  }
}
