'use strict'

const path = require('path')

const fse = require('fs-extra')
const memoize = require('mem')

const {Disposable} = require('atom')

const util = require('./util')

const PATHS = {
  customisableStyles: path.join(
    util.THEME_PATH,
    'styles/customisable/compiled.css'
  ),
  variables: path.join(util.THEME_PATH, 'styles/user-defined-variables.less')
}

const variables = {
  synced: {},
  unsynced: {}
}

const styleElement = document.createElement('style')

const generateLessVariableSyntax = (name, value) => `@${name}: ${value};`

const readCustomisableStyles = memoize(
  () => fse.readFile(PATHS.customisableStyles, 'utf8')
)

const insertStyleVariablesIntoCss = css => {
  const combinedVariables = Object.assign(
    {},
    variables.synced,
    variables.unsynced
  )

  for (const [name, value] of Object.entries(combinedVariables)) {
    css = css.replace(RegExp(`"${name}"`, 'g'), value)
  }

  return css
}

const generateVariablesText = () => {
  return Object.entries(variables.synced)
    .map(variableData => generateLessVariableSyntax(...variableData))
    .join('\n')
}

const activate = () => {
  document.head.appendChild(styleElement)
  return new Disposable(() => styleElement.remove())
}

const injectStyles = async () => {
  const css = insertStyleVariablesIntoCss(await readCustomisableStyles())
  styleElement.textContent = css
}

const writeVariables = () => {
  return fse.writeFile(PATHS.variables, generateVariablesText())
}

module.exports = {
  variables,
  activate,
  injectStyles,
  writeVariables
}
