'use strict'

const styles = require('../styles')
const util = require('../util')

const IMAGE_BACKGROUND_MODE = 'Image'
const IMAGE_BACKGROUND_CLASS = `${util.SHORT_PACKAGE_NAME}-background-image`

module.exports = {
  backgroundMode: {
    callback (backgroundMode) {
      document.body.classList.toggle(
        IMAGE_BACKGROUND_CLASS,
        backgroundMode === IMAGE_BACKGROUND_MODE
      )
    }
  },
  mainFontSize: {
    delayed: true,
    callback (fontSize) {
      styles.variables['font-size'] = fontSize
    }
  },
  statusBarFontSize: {
    delayed: true,
    callback (fontSize) {
      styles.variables['status-bar-font-size'] = fontSize
    }
  }
}
