'use strict'

const styleInjection = require('./styleInjection')
const util = require('./util')

const DONT_STYLE_THE_EDITOR_CLASS = 'really-black-ui-dont-style-the-editor'

const secondaryColor = secondaryColor => {
  secondaryColor = util.handleAtomColor(secondaryColor)
  const variables = util.generateSecondaryColorVariables(secondaryColor)
  Object.assign(styleInjection.variables, variables)
}

const mainFontSize = fontSize => {
  styleInjection.variables['main-font-size'] = `${fontSize}px`
}

const statusBarFontSize = fontSize => {
  styleInjection.variables['status-bar-font-size'] = fontSize
}

const styleTheEditor = value => {
  styleInjection.variables['style-the-editor'] = value
  document.body.classList.toggle(DONT_STYLE_THE_EDITOR_CLASS, !value)
}

module.exports = {
  secondaryColor,
  mainFontSize,
  statusBarFontSize,
  styleTheEditor
}
