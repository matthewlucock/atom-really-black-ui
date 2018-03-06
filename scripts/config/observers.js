'use strict'

const styleInjection = require('../styleInjection')
const util = require('../util')

const IMAGE_BACKGROUND_MODE = 'Image'
const DONT_STYLE_THE_EDITOR_CLASS = 'pure-dont-style-the-editor'

const observers = {
  'general.backgroundMode': {
    callback (backgroundMode) {
      const isImageMode = backgroundMode === IMAGE_BACKGROUND_MODE
      document.body.classList.toggle('pure-background-image', isImageMode)
    }
  },
  'general.mainFontSize': {
    callback (fontSize) {
      styleInjection.variables.synced['font-size'] = `${fontSize}px`
    },
    delayed: true
  },
  'general.statusBarFontSize': {
    callback (fontSize) {
      styleInjection.variables.synced['status-bar-font-size'] = fontSize
    },
    delayed: true
  },
  'general.styleTheEditor': {
    callback (styleTheEditor) {
      styleInjection.variables.synced['style-the-editor'] = styleTheEditor
      document.body.classList.toggle(DONT_STYLE_THE_EDITOR_CLASS, !styleTheEditor)
    }
  },
  "solidColorBackgrounds.backgroundColor": {
    callback (backgroundColor) {
      backgroundColor = util.handleAtomColor(backgroundColor)
      const textColor = util.getMainTextColorFromBackgroundColor(
        backgroundColor
      )

      styleInjection.variables.synced['base-background-color'] = (
        backgroundColor.hex()
      )
      styleInjection.variables.synced['text-color'] = textColor.hex()
    }
  },
  'solidColorBackgrounds.accentColor': {
    callback (accentColor) {
      accentColor = util.handleAtomColor(accentColor)
      const textColor = util.getMainTextColorFromBackgroundColor(accentColor)

      Object.assign(styleInjection.variables.synced, {
        'accent-color-translucent': accentColor.hex(),
        'accent-color-opaque': accentColor.hex(),
        'accented-text-color': textColor.hex()
      })
    }
  }
}

module.exports = observers
