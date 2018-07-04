'use strict'

const config = require('../config')
const styles = require('../styles')
const util = require('../util')

const setAccent = (color, alphaChannel) => {
  const blendedColor = util.BLACK.mix(color, alphaChannel)
  const textColor = util.getContrastingTextColor(blendedColor)
  const translucentColor = color.alpha(alphaChannel)

  Object.assign(styles.variables, {
    'image-background-accent-color-opaque': blendedColor.string(),
    'image-background-accent-color-translucent': translucentColor.string(),
    'image-background-accented-text-color': textColor.string()
  })
}

module.exports = {
  overlayAlphaChannel: {
    delayed: true,
    callback (overlayAlphaChannel) {
      const overlayColor = util.BLACK.alpha(overlayAlphaChannel)
      styles.variables['image-background-overlay'] = overlayColor.string()
    }
  },
  accentColor: {
    callback (color) {
      const alphaChannel = config.get('imageBackgrounds.accentAlphaChannel')
      setAccent(color, alphaChannel)
    }
  },
  accentAlphaChannel: {
    delayed: true,
    callback (alphaChannel) {
      const color = config.get('imageBackgrounds.accentColor')
      setAccent(color, alphaChannel)
    }
  }
}
