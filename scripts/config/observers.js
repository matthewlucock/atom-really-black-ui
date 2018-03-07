'use strict'

const styleInjection = require('../styleInjection')
const util = require('../util')

const IMAGE_BACKGROUND_MODE = 'Image'

const CLASS_NAMES = {
  imageBackgroundMode: `${util.SHORT_PACKAGE_NAME}-background-image`,
  dontStyleTheEditor: `${util.SHORT_PACKAGE_NAME}-dont-style-the-editor`
}

const observers = {
  'general.backgroundMode': {
    callback (backgroundMode) {
      const isImageMode = backgroundMode === IMAGE_BACKGROUND_MODE
      document.body.classList.toggle(
        CLASS_NAMES.imageBackgroundMode,
        isImageMode
      )
    }
  },
  'general.mainFontSize': {
    delayed: true,
    sync: true,
    callback (fontSize) {
      styleInjection.variables.synced['font-size'] = `${fontSize}px`
    }
  },
  'general.statusBarFontSize': {
    delayed: true,
    sync: true,
    callback (fontSize) {
      styleInjection.variables.synced['status-bar-font-size'] = fontSize
    }
  },
  'general.styleTheEditor': {
    sync: true,
    callback (styleTheEditor) {
      styleInjection.variables.synced['style-the-editor'] = styleTheEditor
      document.body.classList.toggle(
        CLASS_NAMES.dontStyleTheEditor,
        !styleTheEditor
      )
    }
  },
  'solidColorBackgrounds.backgroundColor': {
    sync: true,
    callback (backgroundColor) {
      backgroundColor = util.wrapAtomColor(backgroundColor)
      const textColor = util.getTextColorFromBackgroundColor(backgroundColor)

      styleInjection.variables.synced['base-background-color'] = (
        backgroundColor.string()
      )
      styleInjection.variables.synced['text-color'] = textColor.string()
    }
  },
  'solidColorBackgrounds.accentColor': {
    sync: true,
    callback (accentColor) {
      accentColor = util.wrapAtomColor(accentColor)
      const textColor = util.getTextColorFromBackgroundColor(accentColor)

      Object.assign(styleInjection.variables.synced, {
        'accent-color-translucent': accentColor.string(),
        'accent-color-opaque': accentColor.string(),
        'accented-text-color': textColor.string()
      })
    }
  }
}

module.exports = observers
