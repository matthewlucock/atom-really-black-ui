'use strict'

const {CompositeDisposable} = require('atom')

const configUtil = require('./util')
const observers = require('./observers')
const {makeObserver, clearObserverTimeouts} = require('./makeObserver')

const disposables = new CompositeDisposable()

const activate = () => {
  for (const [keySuffix, observerConfig] of Object.entries(observers)) {
    const key = configUtil.makeKey(keySuffix)
    const observer = makeObserver(observerConfig)
    disposables.add(atom.config.observe(key, observer))
  }
}

const deactivate = () => {
  disposables.dispose()
  clearObserverTimeouts()
}

module.exports = {activate, deactivate}
