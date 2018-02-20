'use strict'

const styleInjection = require('./styleInjection')
const util = require('./util')

const observerTimeouts = new Map()
const timeoutDuration = 500

const wrapCallback = callback => {
  return value => {
    callback(value)

    if (util.themeHasActivated) {
      styleInjection.injectStyles()
      styleInjection.writeVariables()
    }
  }
}

const makeConfigObserver = ({callback, timeout}) => {
  callback = wrapCallback(callback)
  const observerId = Math.random()

  return value => {
    const boundCallback = callback.bind(undefined, value)

    if (timeout && util.themeHasActivated) {
      clearTimeout(observerTimeouts.get(observerId))
      const timeoutId = setTimeout(boundCallback, timeoutDuration)
      observerTimeouts.set(observerId, timeoutId)
    } else {
      boundCallback()
    }
  }
}

module.exports = {makeConfigObserver, observerTimeouts}
