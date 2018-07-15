'use strict'

const path = require('path')

const {Disposable} = require('atom')

const fse = require('fs-extra')

const {THEME_PATH} = require('./data')

const FILE_PATH = path.join(THEME_PATH, 'styles/customizable-variables.less')

const cssVariable = ([name, value]) => `--pure-${name}: ${value};`
const lessVariable = ([name, value]) => `@${name}: ${value};`

const styleElement = document.createElement('style')

module.exports = {
  values: {},
  inject () {
    const variablesText = Object.entries(this.values).map(cssVariable).join('')
    styleElement.textContent = `:root {${variablesText}}`
  },
  async write () {
    const variablesText = Object.entries(this.values).map(lessVariable).join('')
    await fse.writeFile(FILE_PATH, variablesText)
  },
  activate () {
    document.head.appendChild(styleElement)
    return new Disposable(() => styleElement.remove())
  }
}
