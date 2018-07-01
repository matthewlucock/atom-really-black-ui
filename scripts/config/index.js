'use strict'

const {CompositeDisposable} = require('atom')

const configUtil = require('./util')
const observers = require('./observers')
const makeObserver = require('./makeObserver')

const activate = () => {
  const disposables = new CompositeDisposable()

  for (const [keySuffix, observerConfig] of Object.entries(observers)) {
    const key = configUtil.makeKey(keySuffix)
    const observer = makeObserver(observerConfig)
    disposables.add(atom.config.observe(key, observer))
  }

  return disposables
}

module.exports = {activate}
