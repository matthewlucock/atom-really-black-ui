'use strict'

const {Disposable, CompositeDisposable} = require('atom')

const configObservers = require('./config/observers')
const manageBackgroundImages = require('./backgroundImages')
const styles = require('./styles')
const util = require('./util')

const disposables = new CompositeDisposable()

const activate = () => {
  disposables.add(
    configObservers.activate(),
    styles.activate(),
    new Disposable(() => {
      manageBackgroundImages.deactivate()
      util.themeIsActive = false
    })
  )

  manageBackgroundImages.activate()
  util.themeIsActive = true
}

const deactivate = () => {
  disposables.dispose()
}

module.exports = {activate, deactivate}
