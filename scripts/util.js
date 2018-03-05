'use strict'

const path = require('path')

const Color = require('color')
const mapObject = require('map-obj')

const BLACK = Color('black')
const WHITE = Color('white')

const SECONDARY_COLOR_SHADE_MODIFIER = 0.1
const GIT_TEXT_COLOR_DARKEN_AMOUNT = 0.5

const GIT_LIGHT_TEXT_COLORS = mapObject(
  {
    'added': '#73c990',
    'modified': '#e2c08d',
    'removed': '#ff6347',
    'renamed': '#6494ed',
    'ignored': '#b3b3b3'
  },
  (key, value) => [`git-text-color-${key}-selected`, value]
)

const GIT_DARK_TEXT_COLORS = mapObject(GIT_LIGHT_TEXT_COLORS, (key, value) => {
  return [key, Color(value).darken(GIT_TEXT_COLOR_DARKEN_AMOUNT).hex()]
})

const handleAtomColor = atomColor => Color(atomColor.toHexString())

const getMainTextColorFromBackgroundColor = backgroundColor => {
  return backgroundColor.isDark() ? WHITE : BLACK
}

const generateSecondaryColorVariables = secondaryColor => {
  const textColor = getMainTextColorFromBackgroundColor(secondaryColor)

  const firstShade = secondaryColor.lighten(SECONDARY_COLOR_SHADE_MODIFIER)
  const secondShade = secondaryColor.darken(SECONDARY_COLOR_SHADE_MODIFIER)
  const firstShadeTextColor = getMainTextColorFromBackgroundColor(firstShade)
  const secondShadeTextColor = getMainTextColorFromBackgroundColor(secondShade)

  let variables = mapObject(
    {
      'secondary-color': secondaryColor,
      'secondary-color-text-color': textColor,
      'secondary-color-first-shade': firstShade,
      'secondary-color-second-shade': secondShade,
      'secondary-color-first-shade-text-color': firstShadeTextColor,
      'secondary-color-second-shade-text-color': secondShadeTextColor
    },
    (key, value) => [key, value.hex()]
  )

  const gitTextColorVariables = (
    secondaryColor.isDark() ? GIT_LIGHT_TEXT_COLORS : GIT_DARK_TEXT_COLORS
  )
  Object.assign(variables, gitTextColorVariables)

  return variables
}

const getFileUri = absolutePath => {
  absolutePath = absolutePath.replace(/\\/g, '/')
  return `file:///${absolutePath}`
}

const getPathInTheme = path.join.bind(
  undefined,
  atom.packages.resolvePackagePath('pure-ui')
)

module.exports = {
  handleAtomColor,
  getMainTextColorFromBackgroundColor,
  generateSecondaryColorVariables,
  getFileUri,
  getPathInTheme,
  themeHasActivated: false
}
