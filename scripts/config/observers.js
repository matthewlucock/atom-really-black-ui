'use strict'

const {CompositeDisposable} = require('atom')

const backgroundImages = require('../backgroundImages')
const config = require('.')
const styleVariables = require('../styleVariables')
const utilities = require('../utilities')

const setAccent = (color, alphaChannel) => {
  const blendedColor = utilities.BLACK.mix(color, alphaChannel)
  const textColor = utilities.getContrastingTextColor(blendedColor)
  const translucentColor = color.alpha(alphaChannel)

  Object.assign(styleVariables.values, {
    'image-background-accent-color-opaque': blendedColor,
    'image-background-accent-color-translucent': translucentColor,
    'image-background-accented-text-color': textColor
  })
}

const observers = {
  'general.backgroundMode': {
    updateStyles: false,
    callback (backgroundMode) {
      const imageMode = backgroundMode === 'Image'

      if (imageMode) {
        document.body.classList.add('pure-background-image', imageMode)
        backgroundImages.activate()
      } else {
        document.body.classList.remove('pure-background-image', imageMode)
        backgroundImages.deactivate()
      }
    }
  },
  'general.mainFontSize': {
    delayed: true,
    callback (fontSize) {
      styleVariables.values['font-size'] = fontSize
    }
  },
  'general.statusBarFontSize': {
    delayed: true,
    callback (fontSize) {
      styleVariables.values['status-bar-font-size'] = fontSize
    }
  },
  'imageBackgrounds.overlayAlphaChannel': {
    delayed: true,
    callback (overlayAlphaChannel) {
      const overlayColor = utilities.BLACK.alpha(overlayAlphaChannel)
      styleVariables.values['image-background-overlay'] = overlayColor
    }
  },
  'imageBackgrounds.accentColor': {
    callback (color) {
      const alphaChannel = config.get('imageBackgrounds.accentAlphaChannel')
      setAccent(color, alphaChannel)
    }
  },
  'imageBackgrounds.accentAlphaChannel': {
    delayed: true,
    callback (alphaChannel) {
      const color = config.get('imageBackgrounds.accentColor')
      setAccent(color, alphaChannel)
    }
  },
  'solidColorBackgrounds.backgroundColor': {
    callback (backgroundColor) {
      const textColor = utilities.getContrastingTextColor(backgroundColor)

      Object.assign(styleVariables.values, {
        'base-background-color': backgroundColor,
        'text-color': textColor
      })
    }
  },
  'solidColorBackgrounds.accentColor': {
    callback (accentColor) {
      const textColor = utilities.getContrastingTextColor(accentColor)

      Object.assign(styleVariables.values, {
        'solid-color-background-accent-color': accentColor,
        'solid-color-background-accented-text-color': textColor
      })
    }
  }
}

module.exports = {
  activate () {
    return new CompositeDisposable(
      ...Object.entries(observers).map(([key, observerConfig]) => {
        return config.observe(key, observerConfig)
      })
    )
  }
}
