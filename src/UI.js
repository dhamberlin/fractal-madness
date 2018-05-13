const UI = {
  state: {
    isSettingsPanelOpen: false
  },

  init() {
    utils.addListeners()
  },

  toggleUI() {
    const controls = document.querySelector('.controls')
    if (controls.classList.contains('fade-in')) {
      controls.classList.replace('fade-in', 'fade-out')
    } else {
      controls.classList.replace('fade-out', 'fade-in')
    }
  },

  toggleSettingsPanel(e) {
    const { isSettingsPanelOpen } = this.state
    if (e && e.stopPropagation) {
      e.stopPropagation()
      e.preventDefault()
    }
    if (isSettingsPanelOpen) {
      document.querySelector('.settings-overlay').classList.replace('fade-in', 'fade-out')
    } else {
      document.querySelector('.settings-overlay').classList.replace('fade-out', 'fade-in')
    }
    this.state.isSettingsPanelOpen = !isSettingsPanelOpen
  },

  handleKeyDown(e) {
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
}
