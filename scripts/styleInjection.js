'use strict'

const fse = require('fs-extra')

const util = require('./util')

const PATHS = {
  customisableStyles: 'styles/customisable/compiled.css',
  styleVariables: 'styles/user-defined-variables.less'
}

const styleVariables = new Map()
let customisableStylesReadPromise
let styleVariablesWritePromise

const styleElement = document.createElement('style')
styleElement.id = 'really-black-ui-customsiable-styles'

const insertStyleVariablesIntoCSS = css => {
  for (const [name, value] of styleVariables) {
    const nameRegExp = RegExp(`"${name}"`, 'g')
    css = css.replace(nameRegExp, value)
  }

  return css
}

const generateStyleVariablesText = () => {
  let variablesText = ''

  for (const [name, value] of styleVariables) {
    variablesText += util.generateLessVariableSyntax(name, value)
  }

  return variablesText
}

const writeStyleVariables = async () => {
  const variablesText = generateStyleVariablesText()
  await fse.writeFile(PATHS.styleVariables, variablesText)
}

const init = () => {
  customisableStylesReadPromise = fse.readFile(PATHS.customisableStyles, 'utf8')
  document.head.appendChild(styleElement)
}

const injectStyles = async () => {
  const {css} = insertStyleVariablesIntoCSS(await customisableStylesReadPromise)
  styleElement.textContent = css
}

const updateStyleVariablesFile = () => {
  styleVariablesWritePromise = (async () => {
    try {
      await styleVariablesWritePromise
    } catch (_) {}

    return writeStyleVariables()
  })()
}

module.exports = {
  styleVariables,
  init,
  injectStyles,
  styleElement,
  updateStyleVariablesFile
}
