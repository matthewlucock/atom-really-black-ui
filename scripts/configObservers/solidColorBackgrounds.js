'use strict'

const styleInjection = require('../styleInjection')
const util = require('../util')

const backgroundColor = {
  sync: true,
  callback (backgroundColor) {
    backgroundColor = util.wrapAtomColor(backgroundColor)
    const textColor = util.getTextColorFromBackgroundColor(backgroundColor)

    styleInjection.variables.synced['base-background-color'] = (
      backgroundColor.string()
    )
    styleInjection.variables.synced['text-color'] = textColor.string()
  }
}

const accentColor = {
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

module.exports = {backgroundColor, accentColor}
