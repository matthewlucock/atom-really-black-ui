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
  sync: true,
  callback (fontSize) {
    styleInjection.variables.synced['font-size'] = fontSize
  }
}

const statusBarFontSize = {
  delayed: true,
  sync: true,
  callback (fontSize) {
    styleInjection.variables.synced['status-bar-font-size'] = fontSize
  }
}

const styleTheEditor = {
  sync: true,
  callback (styleTheEditor) {
    styleInjection.variables.synced['style-the-editor'] = styleTheEditor

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
