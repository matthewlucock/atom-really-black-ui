'use strict'

const path = require('path')
const {Disposable} = require('atom')
const delay = require('delay')
const fse = require('fs-extra')
const config = require('./config')
const makeCustomizableVariables = require('../styles/customizableVariables')
const {THEME_PATH} = require('./utilities')

const FILE_PATH = path.join(THEME_PATH, 'styles/customizable-variables.less')

const INTERFACE_TRANSITION_CLASS = 'pure-interface-transition'
const INTERFACE_TRANSITION_DURATION = 1000

const cssVariable = ([name, value]) => `--pure-${name}:${value};`
const lessVariable = ([name, value]) => `@pure-${name}:${value};`

const styleElement = document.createElement('style')

const inject = async variables => {
  const variablesText = Object.entries(variables).map(cssVariable).join('')
  document.body.classList.add(INTERFACE_TRANSITION_CLASS)
  styleElement.textContent = `:root {${variablesText}}`
  await delay(INTERFACE_TRANSITION_DURATION)
  document.body.classList.remove(INTERFACE_TRANSITION_CLASS)
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
      accent: String(config.get('imageBackground.accent')),
      accentAlpha: config.get('imageBackground.accentAlpha')
    })
  } else {
    Object.assign(data, {
      workspaceColor: String(config.get('solidBackground.workspaceColor')),
      accent: String(config.get('solidBackground.accent'))
    })
  }

  const variables = makeCustomizableVariables(data)
  await Promise.all([inject(variables), write(variables)])
}

const activate = () => {
  document.head.appendChild(styleElement)
  return new Disposable(() => {
    styleElement.remove()
    styleElement.textContent = ''
    document.body.classList.remove(INTERFACE_TRANSITION_CLASS)
  })
}

module.exports = {set, activate}
