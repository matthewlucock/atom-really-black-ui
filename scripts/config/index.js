'use strict'

const {CompositeDisposable} = require('atom')

const observers = require('./observers')
const {clearObserverTimeouts} = require('./makeObserver')

const disposables = new CompositeDisposable()

const makeKey = (keySuffix) => `really-black-ui.${keySuffix}`

const activate = () => {
  for (const [keySuffix, observer] of Object.entries(observers)) {
    const key = makeKey(keySuffix)
    disposables.add(atom.config.observe(key, observer))
  }
}

const deactivate = () => {
  disposables.dispose()
  clearObserverTimeouts()
}

module.exports = {activate, deactivate}
