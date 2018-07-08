'use strict'

const {Disposable, CompositeDisposable} = require('atom')

const activateConfigObservers = require('./configObservers/activate')
const manageBackgroundImages = require('./backgroundImages')
const styles = require('./styles')
const util = require('./util')

const disposables = new CompositeDisposable()

const activate = () => {
  disposables.add(
    activateConfigObservers(),
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
