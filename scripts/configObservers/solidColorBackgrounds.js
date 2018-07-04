'use strict'

const styles = require('../styles')
const util = require('../util')

module.exports = {
  backgroundColor: {
    callback (backgroundColor) {
      const textColor = util.getContrastingTextColor(backgroundColor)

      Object.assign(styles.variables, {
        'base-background-color': backgroundColor.string(),
        'text-color': textColor.string()
      })
    }
  },
  accentColor: {
    callback (accentColor) {
      const textColor = util.getContrastingTextColor(accentColor)

      Object.assign(styles.variables, {
        'solid-color-background-accent-color': accentColor.string(),
        'solid-color-background-accented-text-color': textColor.string()
      })
    }
  }
}
