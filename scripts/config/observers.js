'use strict'

const {CompositeDisposable} = require('atom')

const backgroundImages = require('../backgroundImages')
const config = require('.')
const setStyleVariables = require('../styleVariables/set')

const observers = {
  'general.backgroundMode': {
    callback (backgroundMode) {
      if (backgroundMode === 'Image') {
        backgroundImages.activate()
      } else {
        backgroundImages.deactivate()
      }

      setStyleVariables()
    }
  },
  'general.mainFontSize': {callback: setStyleVariables, delayed: true},
  'general.statusBarFontSize': {callback: setStyleVariables, delayed: true},
  'general.fontFamily': {callback: setStyleVariables},
  'general.scrollbarWidth': {callback: setStyleVariables, delayed: true},
  'imageBackgrounds.overlayAlphaChannel': {
    callback: setStyleVariables,
    delayed: true
  },
  'imageBackgrounds.accentColor': {callback: setStyleVariables},
  'imageBackgrounds.accentAlphaChannel': {
    callback: setStyleVariables,
    delayed: true
  },
  'solidColorBackgrounds.backgroundColor': {callback: setStyleVariables},
  'solidColorBackgrounds.accentColor': {callback: setStyleVariables}
}

const activate = () => {
  return new CompositeDisposable(
    ...Object.entries(observers).map(([key, observerConfig]) => {
      return config.observe(key, observerConfig)
    })
  )
}

module.exports = {activate}
