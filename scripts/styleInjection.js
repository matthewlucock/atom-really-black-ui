'use strict'

const fse = require('fs-extra')

const PATHS = {
  customisableStyles: 'styles/customisable/compiled.css',
  variables: 'styles/user-defined-variables.less'
}

const variables = {}
let customisableStylesReadPromise
let variablesWritePromise

const styleElement = document.createElement('style')

const generateLessVariableSyntax = (name, value) => `@${name}: ${value};`

const insertStyleVariablesIntoCss = css => {
  for (const [name, value] of Object.entries(variables)) {
    css = css.replace(RegExp(`"${name}"`, 'g'), value)
  }

  return css
}

const generateVariablesText = () => {
  return Object.entries(variables)
    .map(variableData => generateLessVariableSyntax(...variableData))
    .join('\n')
}

const init = () => {
  customisableStylesReadPromise = fse.readFile(PATHS.customisableStyles, 'utf8')
  document.head.appendChild(styleElement)
}

const injectStyles = async () => {
  styleElement.textContent = insertStyleVariablesIntoCss(
    await customisableStylesReadPromise
  )
}

const writeVariables = async () => {
  try {
    await variablesWritePromise
  } catch (_) {}

  variablesWritePromise = fse.writeFile(
    PATHS.variables,
    generateVariablesText()
  )

  await variablesWritePromise
}

module.exports = {
  variables,
  styleElement,
  init,
  injectStyles,
  writeVariables
}
