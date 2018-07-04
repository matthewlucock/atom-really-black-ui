'use strict'

const path = require('path')

const fse = require('fs-extra')
const memoize = require('mem')

const {Disposable} = require('atom')

const util = require('./util')

const DIRECTORY = path.join(util.THEME_PATH, 'styles/customizable')
const CUSTOMIZABLE_STYLES_PATH = path.join(DIRECTORY, 'compiled.css')
const VARIABLES_PATH = path.join(DIRECTORY, 'variables.less')

const variables = {}

const styleElement = document.createElement('style')

const generateLessVariableSyntax = (name, value) => `@${name}: ${value};`

const readCustomizableStyles = memoize(
  () => fse.readFile(CUSTOMIZABLE_STYLES_PATH, 'utf8')
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
  const css = insertVariablesIntoCss(await readCustomizableStyles())
  styleElement.textContent = css
}

const writeVariables = () => {
  return fse.writeFile(VARIABLES_PATH, generateVariablesText())
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
