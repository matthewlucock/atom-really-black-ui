'use strict'

const styleInjection = require('./styleInjection')
const util = require('./util')

const OBSERVER_TIMEOUT_DURATION = 500

const makeKey = (keySuffix) => `${util.LONG_PACKAGE_NAME}.${keySuffix}`

const get = keySuffix => {
  const key = makeKey(keySuffix)
  let value = atom.config.get(key)

  const schema = atom.config.getSchema(key)
  if (schema.type === 'color') value = util.wrapAtomColor(value)

  return value
}

const wrapObserverCallback = ({callback, sync}) => {
  return value => {
    callback(value)

    if (util.themeIsActive) {
      styleInjection.injectStyles()
      if (sync) styleInjection.writeVariables()
    }
  }
}

const makeObserver = ({callback, delayed, sync}) => {
  callback = wrapObserverCallback({callback, sync})

  return value => {
    if (delayed && util.themeIsActive) {
      setTimeout(() => callback(value), OBSERVER_TIMEOUT_DURATION)
    } else {
      callback(value)
    }
  }
}

const observe = (keySuffix, observerConfig) => {
  return atom.config.observe(
    makeKey(keySuffix),
    makeObserver(observerConfig)
  )
}

module.exports = {get, observe}
