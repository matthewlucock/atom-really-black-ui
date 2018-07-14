'use strict'

const {CompositeDisposable} = require('atom')

const backgroundImages = require('../backgroundImages')
const config = require('.')
const styles = require('../styles')
const util = require('../util')

const setAccent = (color, alphaChannel) => {
  const blendedColor = util.BLACK.mix(color, alphaChannel)
  const textColor = util.getContrastingTextColor(blendedColor)
  const translucentColor = color.alpha(alphaChannel)

  Object.assign(styles.variables, {
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
      document.body.classList.toggle('pure-background-image', imageMode)
    }
  },
  'general.mainFontSize': {
    delayed: true,
    callback (fontSize) {
      styles.variables['font-size'] = fontSize
    }
  },
  'general.statusBarFontSize': {
    delayed: true,
    callback (fontSize) {
      styles.variables['status-bar-font-size'] = fontSize
    }
  },
  'imageBackgrounds.overlayAlphaChannel': {
    delayed: true,
    callback (overlayAlphaChannel) {
      const overlayColor = util.BLACK.alpha(overlayAlphaChannel)
      styles.variables['image-background-overlay'] = overlayColor
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
      const textColor = util.getContrastingTextColor(backgroundColor)

      Object.assign(styles.variables, {
        'base-background-color': backgroundColor,
        'text-color': textColor
      })
    }
  },
  'solidColorBackgrounds.accentColor': {
    callback (accentColor) {
      const textColor = util.getContrastingTextColor(accentColor)

      Object.assign(styles.variables, {
        'solid-color-background-accent-color': accentColor,
        'solid-color-background-accented-text-color': textColor
      })
    }
  }
}

module.exports = {
  activate () {
    const disposables = new CompositeDisposable()

    for (const [key, observerConfig] of Object.entries(observers)) {
      disposables.add(config.observe(key, observerConfig))
    }

    return disposables
  }
}
