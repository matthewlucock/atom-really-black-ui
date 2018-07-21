'use strict'

const path = require('path')

const {Disposable} = require('atom')

const fse = require('fs-extra')

const {THEME_PATH} = require('../data')

const FILE_PATH = path.join(THEME_PATH, 'styles/customizable-variables.less')

const cssVariable = ([name, value]) => `--pure-${name}: ${value};`
const lessVariable = ([name, value]) => `@pure-${name}: ${value};`

const styleElement = document.createElement('style')

const inject = values => {
  const variablesText = Object.entries(values).map(cssVariable).join('')
  styleElement.textContent = `:root {${variablesText}}`
}

const write = async values => {
  const variablesText = Object.entries(values).map(lessVariable).join('')
  await fse.writeFile(FILE_PATH, variablesText)
}

const activate = () => {
  document.head.appendChild(styleElement)
  return new Disposable(() => {
    styleElement.remove()
    styleElement.textContent = ''
  })
}

module.exports = {inject, write, activate}
