'use strict'

const {CompositeDisposable} = require('atom')

const backgroundImages = require('./backgroundImages')
const configObservers = require('./config/observers')
const data = require('./data')
const opener = require('./opener')
const styleVariables = require('./styleVariables')

let disposables

const activate = () => {
  disposables = new CompositeDisposable(
    configObservers.activate(),
    opener.activate(),
    styleVariables.activate()
  )

  data.themeIsActive = true
}

const deactivate = () => {
  disposables.dispose()
  backgroundImages.deactivate()
  data.themeIsActive = false
}

module.exports = {activate, deactivate}
