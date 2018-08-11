'use strict'

const {Disposable, CompositeDisposable} = require('atom')
const backgroundImages = require('./backgroundImages')
const customizableVariables = require('./customizableVariables')
const opener = require('./opener')
const utilities = require('./utilities')

let disposables

module.exports = {
  activate: () => {
    disposables = new CompositeDisposable(
      backgroundImages.bindConfigListener(),
      customizableVariables.activate(),
      opener.activate(),
      new Disposable(() => {
        utilities.themeIsActive = false
      })
    )

    utilities.themeIsActive = true
  },
  deactivate: () => disposables.dispose()
}
