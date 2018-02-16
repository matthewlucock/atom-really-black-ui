'use strict'

const Color = require('color')
const mapAssign = require('map-assign')

const BLACK = Color('black')
const WHITE = Color('white')

const SECONDARY_COLOR_VARIABLE_PREFIX = 'secondary-color-'
const SECONDARY_COLOR_SHADE_MODIFIER = 0.1

const GIT_LIGHT_TEXT_COLOR_VARIABLES = new Map(
  [
    ['added', '#73c990'],
    ['modified', '#e2c08d'],
    ['removed', '#ff6347'],
    ['renamed', '#6494ed'],
    ['ignored', '#b3b3b3']
  ].map(([name, value]) => [`git-text-color-${name}-selected`, value])
)

const GIT_TEXT_COLOR_DARKEN_AMOUNT = 0.5

const GIT_DARK_TEXT_COLOR_VARIABLES = new Map(
  [...GIT_LIGHT_TEXT_COLOR_VARIABLES].map(([name, value]) => {
    return [name, Color(value).darken(GIT_TEXT_COLOR_DARKEN_AMOUNT).hex()]
  })
)

const handleAtomColor = atomColor => Color(atomColor.toHexString())

const generateLessVariableSyntax = (name, value) => `@${name}: ${value};\n`

const getContrastedTextColors = options => {
  if (options.backgroundColor.dark()) return options.lightColors
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

  let variables = new Map(
    [
      ['text-color', textColor],
      ['first-shade', firstShade],
      ['second-shade', secondShade],
      ['first-shade-text-color', firstShadeTextColor],
      ['second-shade-text-color', secondShadeTextColor]
    ].map(([name, value]) => [SECONDARY_COLOR_VARIABLE_PREFIX + name, value])
  )

  variables.set('secondary-color', secondaryColor)
  variables = new Map(
    [...variables].map(([name, value]) => [name, value.hex()])
  )

  const gitTextColorVariables = getGitTextColorVariables(secondaryColor)
  mapAssign(variables, gitTextColorVariables)

  return variables
}

module.exports = {
  handleAtomColor,
  generateLessVariableSyntax,
  generateVariablesFromSecondaryColor,
  themeHasActivated: false
}
