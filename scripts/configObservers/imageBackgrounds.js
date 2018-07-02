'use strict'

const config = require('../config')
const styles = require('../styles')
const util = require('../util')

const overlayAlphaChannel = {
  delayed: true,
  callback (overlayAlphaChannel) {
    const overlayColor = util.BLACK.alpha(overlayAlphaChannel)
    styles.variables['image-background-overlay'] = overlayColor.string()
  }
}

const accentColor = {
  callback (accentColor) {
    const accentAlphaChannel = config.get('imageBackgrounds.accentAlphaChannel')

    const blendedAccentColor = util.BLACK.mix(accentColor, accentAlphaChannel)
    const translucentAccentColor = accentColor.alpha(accentAlphaChannel)
    const textColor = util.getTextColorFromBackgroundColor(blendedAccentColor)

    Object.assign(styles.variables, {
      'image-background-accent-color-opaque': blendedAccentColor.string(),
      'image-background-accent-color-translucent': (
        translucentAccentColor.string()
      ),
      'image-background-accented-text-color': textColor.string()
    })
  }
}

const accentAlphaChannel = {
  delayed: true,
  callback (accentAlphaChannel) {
    const accentColor = config.get('imageBackgrounds.accentColor')

    const blendedAccentColor = util.BLACK.mix(accentColor, accentAlphaChannel)
    const translucentAccentColor = accentColor.alpha(accentAlphaChannel)
    const textColor = util.getTextColorFromBackgroundColor(blendedAccentColor)

    Object.assign(styles.variables, {
      'image-background-accent-color-opaque': blendedAccentColor.string(),
      'image-background-accent-color-translucent': (
        translucentAccentColor.string()
      ),
      'image-background-accented-text-color': textColor.string()
    })
  }
}

module.exports = {overlayAlphaChannel, accentColor, accentAlphaChannel}
