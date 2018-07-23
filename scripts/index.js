'use strict'

const {CompositeDisposable} = require('atom')
const backgroundImages = require('./backgroundImages')
const configObservers = require('./config/observers')
const customizableVariables = require('./customizableVariables')
const opener = require('./opener')
const utilities = require('./utilities')

let disposables

const activate = () => {
  disposables = new CompositeDisposable(
    configObservers.activate(),
    opener.activate(),
    customizableVariables.activate()
  )

  utilities.themeIsActive = true
}

const deactivate = () => {
  disposables.dispose()
  backgroundImages.deactivate()
  utilities.themeIsActive = false
}

module.exports = {activate, deactivate}
