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

const variables = {}

const styleElement = document.createElement('style')

const generateLessVariableSyntax = (name, value) => `@${name}: ${value};`

const readCustomisableStyles = memoize(
  () => fse.readFile(PATHS.customisableStyles, 'utf8')
)

const insertVariablesIntoCss = css => {
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

const inject = async () => {
  const css = insertVariablesIntoCss(await readCustomisableStyles())
  styleElement.textContent = css
}

const writeVariables = () => {
  return fse.writeFile(PATHS.variables, generateVariablesText())
}

const activate = () => {
  document.head.appendChild(styleElement)
  return new Disposable(() => styleElement.remove())
}

module.exports = {
  variables,
  inject,
  writeVariables,
  activate
}
