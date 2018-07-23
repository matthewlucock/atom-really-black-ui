'use strict'

const {CompositeDisposable} = require('atom')
const backgroundImages = require('../backgroundImages')
const config = require('.')
const customizableVariables = require('../customizableVariables')

const observers = {
  'general.background': {
    callback (backgroundMode) {
      if (backgroundMode === 'Image') {
        backgroundImages.activate()
      } else {
        backgroundImages.deactivate()
      }

      customizableVariables.set()
    }
  },
  'general.fontFamily': {callback: customizableVariables.set},
  'general.baseFontSize': {callback: customizableVariables.set, delayed: true},
  'general.statusBarFontSize': {
    callback: customizableVariables.set,
    delayed: true
  },
  'general.scrollbarWidth': {
    callback: customizableVariables.set,
    delayed: true
  },
  'imageBackground.workspaceAlpha': {
    callback: customizableVariables.set,
    delayed: true
  },
  'imageBackground.accent': {callback: customizableVariables.set},
  'imageBackground.accentAlpha': {
    callback: customizableVariables.set,
    delayed: true
  },
  'solidBackground.workspaceColor': {
    callback: customizableVariables.set
  },
  'solidBackground.accent': {callback: customizableVariables.set}
}

const activate = () => {
  return new CompositeDisposable(
    ...Object.entries(observers).map(([key, observerConfig]) => {
      return config.observe(key, observerConfig)
    })
  )
}

module.exports = {activate}
