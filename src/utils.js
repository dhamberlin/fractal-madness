const utils = {
  addListeners() {
    // Settings listeners
    document.getElementById('settingsForm').addEventListener('submit', setSettings);
    document.getElementById('animate-button').addEventListener('click', handleAnimateClick)
    document.getElementById('save-view').addEventListener('click', saveView)
    document.getElementById('load-view').addEventListener('click', loadView)
    // document.getElementById('capture-view').addEventListener('click', captureView)
    const settingsIcons = document.getElementsByClassName('settings-icon')
    Array.from(settingsIcons).forEach(el => el.addEventListener('click', UI.toggleSettingsPanel.bind(UI)))
    document.querySelector('.decrease-iterations').addEventListener('click', decreaseIterations)
    document.querySelector('.increase-iterations').addEventListener('click', increaseIterations)



    // navigation listeners
    window.addEventListener('keydown', UI.handleKeyDown)
    document.querySelector('.zoom-in').addEventListener('click', zoomIn)
    document.querySelector('.zoom-out').addEventListener('click', zoomOut)
    document.querySelector('.pan-left').addEventListener('click', panLeft)
    document.querySelector('.pan-right').addEventListener('click', panRight)
    document.querySelector('.pan-up').addEventListener('click', panUp)
    document.querySelector('.pan-down').addEventListener('click', panDown)
    document.querySelector('.ui-wrap').addEventListener('click', UI.toggleUI)
    window.addEventListener('resize', handleResize)

    // disable double-tab zoom on ui icons
    document.querySelector('.ui-zoom').addEventListener('click', stopPropagationAndPreventDefault)
    document.querySelector('.ui-pan').addEventListener('click', stopPropagationAndPreventDefault)
  }
}
