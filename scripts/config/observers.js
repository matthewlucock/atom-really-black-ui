'use strict'

const {makeObserver} = require('./makeObserver')
const styleInjection = require('../styleInjection')
const util = require('../util')

const secondaryColor = makeObserver({
  callback (secondaryColor) {
    secondaryColor = util.handleAtomColor(secondaryColor)
    const variables = util.generateSecondaryColorVariables(secondaryColor)
    Object.assign(styleInjection.variables, variables)
  }
})

const mainFontSize = makeObserver({
  callback (fontSize) {
    styleInjection.variables['font-size'] = `${fontSize}px`
  },
  delayed: true
})

const statusBarFontSize = makeObserver({
  callback (fontSize) {
    styleInjection.variables['status-bar-font-size'] = fontSize
  },
  delayed: true
})

const DONT_STYLE_THE_EDITOR_CLASS = 'really-black-ui-dont-style-the-editor'

const styleTheEditor = makeObserver({
  callback (styleTheEditor) {
    styleInjection.variables['style-the-editor'] = styleTheEditor
    document.body.classList.toggle(DONT_STYLE_THE_EDITOR_CLASS, !styleTheEditor)
  }
})

module.exports = {
  secondaryColor,
  mainFontSize,
  statusBarFontSize,
  styleTheEditor
}
