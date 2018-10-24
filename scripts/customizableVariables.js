'use strict'

// This modules is used to handle the generation, injection, and writing of
// customizable style variables.

const path = require('path')
const { Disposable, CompositeDisposable } = require('atom')
const delay = require('delay')
const { writeFile } = require('fs-extra')
const config = require('./config')
const makeCustomizableVariables = require('../styles/customizableVariables')
const { ROOT_PATH } = require('./utilities')

const FILE_PATH = path.join(ROOT_PATH, 'styles/customizable-variables.less')

const INTERFACE_TRANSITION_CLASS = 'pure-interface-transition'
const INTERFACE_TRANSITION_DURATION = 1000

const cssVariable = ([name, value]) => `--pure-${name}:${value};`
const lessVariable = ([name, value]) => `@pure-${name}:${value};`

const styleElement = document.createElement('style')

/**
 * @param {Object} variables
 */
const inject = async variables => {
  const variablesText = Object.entries(variables).map(cssVariable).join('')
  document.body.classList.add(INTERFACE_TRANSITION_CLASS)
  styleElement.textContent = `:root {${variablesText}}`
  await delay(INTERFACE_TRANSITION_DURATION)
  document.body.classList.remove(INTERFACE_TRANSITION_CLASS)
}

/**
 * @param {object} variables
 */
const write = async variables => {
  const variablesText = Object.entries(variables).map(lessVariable).join('')
  await writeFile(FILE_PATH, variablesText)
}

/**
 * @param {object} options
 * @param {boolean} options.adjustAccentAutomatically
 */
const set = async options => {
  const data = {
    image: config.get('general.background') === 'Image',
    fontFamily: config.get('general.fontFamily'),
    baseFontSize: config.get('general.baseFontSize'),
    statusBarFontSize: config.get('general.statusBarFontSize'),
    scrollbarWidth: config.get('general.scrollbarWidth')
  }

  const adjustAccentAutomatically = options && options.adjustAccentAutomatically

  if (data.image) {
    Object.assign(data, {
      workspaceAlpha: config.get('imageBackground.workspaceAlpha'),
      accent: String(config.get('imageBackground.accent')),
      accentAlpha: config.get('imageBackground.accentAlpha')
    })
  } else {
    Object.assign(data, {
      workspaceColor: String(config.get('solidBackground.workspaceColor')),
      accent: !adjustAccentAutomatically && String(
        config.get('solidBackground.accent')
      )
    })
  }

  const variables = makeCustomizableVariables(data)

  if (adjustAccentAutomatically) {
    config.disableCallbacks()
    // Sometimes floating point errors occur such that the color string does not
    // fit Atom's color config schema. Rounding the color fixes this problem.
    config.set('solidBackground.accent', String(variables.accent.round()))
    config.enableCallbacks()
  }

  await Promise.all([inject(variables), write(variables)])
}

const bindConfigListeners = () => {
  return new CompositeDisposable(
    config.onDidChange('general.fontFamily', { callback: set }),
    config.onDidChange('general.baseFontSize', {
      callback: set,
      delayed: true
    }),
    config.onDidChange('general.statusBarFontSize', {
      callback: set,
      delayed: true
    }),
    config.onDidChange('general.scrollbarWidth', {
      callback: set,
      delayed: true
    }),
    config.onDidChange('imageBackground.workspaceAlpha', {
      callback: set,
      delayed: true
    }),
    config.onDidChange('imageBackground.accent', { callback: set }),
    config.onDidChange('imageBackground.accentAlpha', {
      callback: set,
      delayed: true
    }),
    config.onDidChange('solidBackground.workspaceColor', {
      callback: () => {
        set({
          adjustAccentAutomatically: config.get(
            'solidBackground.adjustAccentAutomatically'
          )
        })
      }
    }),
    config.onDidChange('solidBackground.accent', { callback: set })
  )
}

const activate = () => {
  document.head.appendChild(styleElement)

  return new CompositeDisposable(
    new Disposable(() => {
      styleElement.remove()
      styleElement.textContent = ''
      document.body.classList.remove(INTERFACE_TRANSITION_CLASS)
    }),
    bindConfigListeners()
  )
}

module.exports = { set, activate }
