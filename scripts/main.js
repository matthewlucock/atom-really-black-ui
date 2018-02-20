'use strict'

const {CompositeDisposable} = require('atom')

const configObserverCallbacks = require('./configObserverCallbacks')
const {makeConfigObserver, observerTimeouts} = require('./makeConfigObserver')
const styleInjection = require('./styleInjection')
const util = require('./util')

const CONFIG_KEY_PREFIX = 'really-black-ui.'

const CONFIG_KEYS = [
  'secondaryColor',
  'mainFontSize',
  'statusBarFontSize',
  'styleTheEditor'
]

const CONFIG_KEYS_WITH_OBSERVER_TIMEOUTS = ['mainFontSize', 'statusBarFontSize']

const disposables = new CompositeDisposable()

const activate = () => {
  styleInjection.init()

  for (const keySuffix of CONFIG_KEYS) {
    const key = CONFIG_KEY_PREFIX + keySuffix

    const observer = makeConfigObserver({
      callback: configObserverCallbacks[keySuffix],
      timeout: CONFIG_KEYS_WITH_OBSERVER_TIMEOUTS.includes(key)
    })

    disposables.add(atom.config.observe(key, observer))
  }

  util.themeHasActivated = true
}

const deactivate = () => {
  disposables.dispose()
  observerTimeouts.forEach(clearTimeout)
  styleInjection.styleElement.remove()
  util.themeHasActivated = false
}

module.exports = {activate, deactivate}
