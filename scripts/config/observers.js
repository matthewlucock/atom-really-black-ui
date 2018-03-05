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
      console.log(1)
    }
  },
  'solidColorBackgrounds.secondaryColor': {
    callback (secondaryColor) {
      secondaryColor = util.handleAtomColor(secondaryColor)
      const variables = util.generateSecondaryColorVariables(secondaryColor)
      Object.assign(styleInjection.variables.synced, variables)
    }
  }
}

module.exports = observers
