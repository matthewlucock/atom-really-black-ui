'use strict'

const utilities = require('../utilities')

const OBSERVER_TIMEOUT_DURATION = 500
const observerTimeouts = new Map()

const makeKey = (keySuffix) => `pure-ui.${keySuffix}`

const get = keySuffix => atom.config.get(makeKey(keySuffix))

const makeObserver = ({callback, delayed}) => {
  const observerId = Math.random()

  return value => {
    const boundCallback = () => callback(value)

    if (delayed && utilities.themeIsActive) {
      clearTimeout(observerTimeouts.get(observerId))
      const timeoutId = setTimeout(boundCallback, OBSERVER_TIMEOUT_DURATION)
      observerTimeouts.set(observerId, timeoutId)
    } else {
      boundCallback()
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
