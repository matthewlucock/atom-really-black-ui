'use strict'

const Color = require('color')
const mapObject = require('map-obj')

const BLACK = Color('black')
const WHITE = Color('white')

const SECONDARY_COLOR_VARIABLE_PREFIX = 'secondary-color-'
const SECONDARY_COLOR_SHADE_MODIFIER = 0.1

const GIT_LIGHT_TEXT_COLOR_VARIABLES = mapObject(
  {
    'added': '#73c990',
    'modified': '#e2c08d',
    'removed': '#ff6347',
    'renamed': '#6494ed',
    'ignored': '#b3b3b3'
  },
  (key, value) => [`git-text-color-${key}-selected`, value]
)

const GIT_TEXT_COLOR_DARKEN_AMOUNT = 0.5

const GIT_DARK_TEXT_COLOR_VARIABLES = mapObject(
  GIT_LIGHT_TEXT_COLOR_VARIABLES,
  (key, value) => {
    return [name, Color(value).darken(GIT_TEXT_COLOR_DARKEN_AMOUNT).hex()]
  }
)

const handleAtomColor = atomColor => Color(atomColor.toHexString())

const generateLessVariableSyntax = (name, value) => `@${name}: ${value};`

const getContrastedTextColors = options => {
  if (options.backgroundColor.isDark()) return options.lightColors
  return options.darkColors
}

const getMainContrastedTextColor = backgroundColor => {
  return getContrastedTextColors({
    backgroundColor,
    lightColors: WHITE,
    darkColors: BLACK
  })
}

const getGitTextColorVariables = backgroundColor => {
  return getContrastedTextColors({
    backgroundColor,
    lightColors: GIT_LIGHT_TEXT_COLOR_VARIABLES,
    darkColors: GIT_DARK_TEXT_COLOR_VARIABLES
  })
}

const generateVariablesFromSecondaryColor = secondaryColor => {
  const textColor = getMainContrastedTextColor(secondaryColor)

  const firstShade = secondaryColor.lighten(SECONDARY_COLOR_SHADE_MODIFIER)
  const secondShade = secondaryColor.darken(SECONDARY_COLOR_SHADE_MODIFIER)
  const firstShadeTextColor = getMainContrastedTextColor(firstShade)
  const secondShadeTextColor = getMainContrastedTextColor(secondShade)

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

  const gitTextColorVariables = getGitTextColorVariables(secondaryColor)
  Object.assign(variables, gitTextColorVariables)

  return variables
}

module.exports = {
  handleAtomColor,
  generateLessVariableSyntax,
  generateVariablesFromSecondaryColor,
  themeHasActivated: false
}
