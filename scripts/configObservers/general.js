'use strict'

const styleInjection = require('../styleInjection')
const util = require('../util')

const IMAGE_BACKGROUND_MODE = 'Image'

const CLASS_NAMES = {
  imageBackgroundMode: `${util.SHORT_PACKAGE_NAME}-background-image`,
  dontStyleTheEditor: `${util.SHORT_PACKAGE_NAME}-dont-style-the-editor`
}

const backgroundMode = {
  callback (backgroundMode) {
    document.body.classList.toggle(
      CLASS_NAMES.imageBackgroundMode,
      backgroundMode === IMAGE_BACKGROUND_MODE
    )
  }
}

const mainFontSize = {
  delayed: true,
  callback (fontSize) {
    styleInjection.variables['font-size'] = fontSize
  }
}

const statusBarFontSize = {
  delayed: true,
  callback (fontSize) {
    styleInjection.variables['status-bar-font-size'] = fontSize
  }
}

const styleTheEditor = {
  callback (styleTheEditor) {
    styleInjection.variables['style-the-editor'] = styleTheEditor

    document.body.classList.toggle(
      CLASS_NAMES.dontStyleTheEditor,
      !styleTheEditor
    )
  }
}

module.exports = {
  backgroundMode,
  mainFontSize,
  statusBarFontSize,
  styleTheEditor
}
