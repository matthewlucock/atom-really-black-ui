'use strict'

// This module is the entry point for the theme.

const { CompositeDisposable } = require('atom')
const backgroundImages = require('./backgroundImages')
const customizableVariables = require('./customizableVariables')

let disposables

module.exports = {
  activate () {
    disposables = new CompositeDisposable(
      backgroundImages.bindConfigListeners(),
      customizableVariables.activate()
    )
  },
  deactivate () {
    disposables.dispose()
  }
}
