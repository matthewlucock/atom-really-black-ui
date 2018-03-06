'use strict'

const styleInjection = require('../styleInjection')
const util = require('../util')

const observerTimeouts = new Map()
const timeoutDuration = 500

const wrapCallback = ({callback, sync}) => {
  return value => {
    callback(value)

    if (util.themeHasActivated) {
      styleInjection.injectStyles()
      if (sync) styleInjection.writeVariables()
    }
  }
}

const makeObserver = ({callback, delayed, sync}) => {
  callback = wrapCallback({callback, sync})
  const observerId = Math.random()

  return value => {
    const boundCallback = callback.bind(undefined, value)

    if (delayed && util.themeHasActivated) {
      clearTimeout(observerTimeouts.get(observerId))
      const timeoutId = setTimeout(boundCallback, timeoutDuration)
      observerTimeouts.set(observerId, timeoutId)
    } else {
      boundCallback()
    }
  }
}

const clearObserverTimeouts = () => {
  observerTimeouts.forEach(clearTimeout)
}

module.exports = {makeObserver, clearObserverTimeouts}
