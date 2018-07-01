'use strict'

const {CompositeDisposable} = require('atom')

const config = require('../config')

const OBSERVER_FILES = [
  'general',
  'imageBackgrounds',
  'solidColorBackgrounds'
]

const handleObserverFile = fileName => {
  const observers = require(`./${fileName}`)
  const disposables = new CompositeDisposable()

  for (const [keySuffix, observerConfig] of Object.entries(observers)) {
    disposables.add(config.observe(`${fileName}.${keySuffix}`, observerConfig))
  }

  return disposables
}

module.exports = () => {
  return new CompositeDisposable(...OBSERVER_FILES.map(handleObserverFile))
}
