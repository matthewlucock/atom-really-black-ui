'use strict'

const styles = require('../styles')
const util = require('../util')

const backgroundColor = {
  callback (backgroundColor) {
    const textColor = util.getTextColorFromBackgroundColor(backgroundColor)

    Object.assign(styles.variables, {
      'base-background-color': backgroundColor.string(),
      'text-color': textColor.string()
    })
  }
}

const accentColor = {
  callback (accentColor) {
    const textColor = util.getTextColorFromBackgroundColor(accentColor)

    Object.assign(styles.variables, {
      'solid-color-background-accent-color': accentColor.string(),
      'solid-color-background-accented-text-color': textColor.string()
    })
  }
}

module.exports = {backgroundColor, accentColor}
