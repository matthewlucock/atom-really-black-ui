'use strict'

const styleInjection = require('../styleInjection')
const util = require('../util')

const backgroundColor = {
  callback (backgroundColor) {
    const textColor = util.getTextColorFromBackgroundColor(backgroundColor)

    Object.assign(styleInjection.variables, {
      'base-background-color': backgroundColor.string(),
      'text-color': textColor.string()
    })
  }
}

const accentColor = {
  callback (accentColor) {
    const textColor = util.getTextColorFromBackgroundColor(accentColor)

    Object.assign(styleInjection.variables, {
      'solid-color-background-accent-color': accentColor.string(),
      'solid-color-background-accented-text-color': textColor.string()
    })
  }
}

module.exports = {backgroundColor, accentColor}
