'use strict'

const path = require('path')
const {Disposable, CompositeDisposable} = require('atom')
const delay = require('delay')
const {writeFile} = require('fs-extra')
const config = require('./config')
const makeCustomizableVariables = require('../styles/customizableVariables')
const utilities = require('./utilities')

const FILE_PATH = path.join(
  utilities.THEME_PATH,
  'styles/customizable-variables.less'
)

const INTERFACE_TRANSITION_CLASS = 'pure-interface-transition'
const INTERFACE_TRANSITION_DURATION = 1000

const CONFIG_KEYS_DELAYED = {
  'general.fontFamily': false,
  'general.baseFontSize': true,
  'general.statusBarFontSize': true,
  'general.scrollbarWidth': true,
  'imageBackground.workspaceAlpha': true,
  'imageBackground.accent': false,
  'imageBackground.accentAlpha': true,
  'solidBackground.workspaceColor': false,
  'solidBackground.accent': false
}

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
  if (!utilities.themeIsActive) return
  const variablesText = Object.entries(variables).map(lessVariable).join('')
  await writeFile(FILE_PATH, variablesText)
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

  return new CompositeDisposable(
    new Disposable(() => {
      styleElement.remove()
      styleElement.textContent = ''
      document.body.classList.remove(INTERFACE_TRANSITION_CLASS)
    }),
    ...Object.entries(CONFIG_KEYS_DELAYED).map(([key, delayed]) => {
      return config.onDidChange(key, {callback: set, delayed})
    })
  )
}

module.exports = {set, activate}
