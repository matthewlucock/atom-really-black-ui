'use strict'

const {CompositeDisposable} = require('atom')

const backgroundImages = require('../backgroundImages')
const config = require('.')
const customizableVariables = require('../customizableVariables')

const observers = {
  'general.backgroundMode': {
    callback (backgroundMode) {
      if (backgroundMode === 'Image') {
        backgroundImages.activate()
      } else {
        backgroundImages.deactivate()
      }

      customizableVariables.set()
    }
  },
  'general.mainFontSize': {callback: customizableVariables.set, delayed: true},
  'general.statusBarFontSize': {
    callback: customizableVariables.set,
    delayed: true
  },
  'general.fontFamily': {callback: customizableVariables.set},
  'general.scrollbarWidth': {
    callback: customizableVariables.set,
    delayed: true
  },
  'imageBackgrounds.overlayAlphaChannel': {
    callback: customizableVariables.set,
    delayed: true
  },
  'imageBackgrounds.accentColor': {callback: customizableVariables.set},
  'imageBackgrounds.accentAlphaChannel': {
    callback: customizableVariables.set,
    delayed: true
  },
  'solidColorBackgrounds.backgroundColor': {
    callback: customizableVariables.set
  },
  'solidColorBackgrounds.accentColor': {callback: customizableVariables.set}
}

const activate = () => {
  return new CompositeDisposable(
    ...Object.entries(observers).map(([key, observerConfig]) => {
      return config.observe(key, observerConfig)
    })
  )
}

module.exports = {activate}
