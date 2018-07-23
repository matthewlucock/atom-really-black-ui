'use strict'

const path = require('path')

const {Disposable} = require('atom')

const fse = require('fs-extra')

const config = require('./config')
const makeCustomizableVariables = require('../styles/customizableVariables')
const {THEME_PATH} = require('./data')

const FILE_PATH = path.join(THEME_PATH, 'styles/customizable-variables.less')

const cssVariable = ([name, value]) => `--pure-${name}:${value};`
const lessVariable = ([name, value]) => `@pure-${name}:${value};`

const styleElement = document.createElement('style')

const inject = variables => {
  const variablesText = Object.entries(variables).map(cssVariable).join('')
  styleElement.textContent = `:root {${variablesText}}`
}

const write = async variables => {
  const variablesText = Object.entries(variables).map(lessVariable).join('')
  await fse.writeFile(FILE_PATH, variablesText)
}

const set = async () => {
  const data = {
    baseFontSize: config.get('general.mainFontSize'),
    statusBarFontSize: config.get('general.statusBarFontSize'),
    fontFamily: config.get('general.fontFamily'),
    scrollbarWidth: config.get('general.scrollbarWidth'),
    image: config.get('general.backgroundMode') === 'Image'
  }

  if (data.image) {
    Object.assign(data, {
      workspaceAlpha: config.get('imageBackgrounds.overlayAlphaChannel'),
      accent: config.get('imageBackgrounds.accentColor'),
      accentAlpha: config.get('imageBackgrounds.accentAlphaChannel')
    })
  } else {
    Object.assign(data, {
      workspaceColor: config.get('solidColorBackgrounds.backgroundColor'),
      accent: config.get('solidColorBackgrounds.accentColor')
    })
  }

  const variables = makeCustomizableVariables(data)
  inject(variables)
  await write(variables)
}

const activate = () => {
  document.head.appendChild(styleElement)
  return new Disposable(() => {
    styleElement.remove()
    styleElement.textContent = ''
  })
}

module.exports = {set, activate}
