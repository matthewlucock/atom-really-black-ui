'use strict'

const configUtil = require('./util')
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
  'imageBackgrounds.overlayAlphaChannel': {
    delayed: true,
    callback (overlayAlphaChannel) {
      const overlayColor = util.BLACK.alpha(overlayAlphaChannel)
      styleInjection.variables.unsynced['image-background-overlay'] = (
        overlayColor.string()
      )
    }
  },
  'imageBackgrounds.accentColor': {
    callback (accentColor) {
      accentColor = util.wrapAtomColor(accentColor)
      const accentAlphaChannel = configUtil.get(
        'imageBackgrounds.accentAlphaChannel'
      )

      const blendedAccentColor = util.BLACK.mix(accentColor, accentAlphaChannel)
      const translucentAccentColor = accentColor.alpha(accentAlphaChannel)
      const textColor = util.getTextColorFromBackgroundColor(
        blendedAccentColor
      )

      Object.assign(styleInjection.variables.unsynced, {
        'image-background-accent-color-opaque': blendedAccentColor.string(),
        'image-background-accent-color-translucent': (
          translucentAccentColor.string()
        ),
        'image-background-accented-text-color': textColor.string()
      })
    }
  },
  'imageBackgrounds.accentAlphaChannel': {
    delayed: true,
    callback (accentAlphaChannel) {
      const accentColor = configUtil.get('imageBackgrounds.accentColor')

      const blendedAccentColor = util.BLACK.mix(accentColor, accentAlphaChannel)
      const translucentAccentColor = accentColor.alpha(accentAlphaChannel)
      const textColor = util.getTextColorFromBackgroundColor(blendedAccentColor)

      Object.assign(styleInjection.variables.unsynced, {
        'image-background-accent-color-opaque': blendedAccentColor.string(),
        'image-background-accent-color-translucent': (
          translucentAccentColor.string()
        ),
        'image-background-accented-text-color': textColor.string()
      })
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
        'solid-color-background-accent-color': accentColor.string(),
        'solid-color-background-accented-text-color': textColor.string()
      })
    }
  }
}

module.exports = observers
