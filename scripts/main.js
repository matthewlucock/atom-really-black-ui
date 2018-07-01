'use strict'

const {Disposable, CompositeDisposable} = require('atom')

const configObservers = require('./configObservers')
const manageBackgroundImages = require('./backgroundImages')
const styleInjection = require('./styleInjection')
const util = require('./util')

const disposables = new CompositeDisposable()

const activate = () => {
  disposables.add(
    configObservers.activate(),
    styleInjection.activate(),
    manageBackgroundImages.activate(),
    new Disposable(() => {
      util.themeIsActive = false
    })
  )

  util.themeIsActive = true
}

const deactivate = () => {
  disposables.dispose()
}

module.exports = {activate, deactivate}
