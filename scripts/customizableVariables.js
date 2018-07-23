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
    image: config.get('general.background') === 'Image',
    fontFamily: config.get('general.fontFamily'),
    baseFontSize: config.get('general.baseFontSize'),
    statusBarFontSize: config.get('general.statusBarFontSize'),
    scrollbarWidth: config.get('general.scrollbarWidth')
  }

  if (data.image) {
    Object.assign(data, {
      workspaceAlpha: config.get('imageBackground.workspaceAlpha'),
      accent: config.get('imageBackground.accent'),
      accentAlpha: config.get('imageBackground.accentAlpha')
    })
  } else {
    Object.assign(data, {
      workspaceColor: config.get('solidBackground.workspaceColor'),
      accent: config.get('solidBackground.accent')
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
