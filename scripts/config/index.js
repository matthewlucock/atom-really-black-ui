'use strict'

const Color = require('color')

const data = require('../data')

const OBSERVER_TIMEOUT_DURATION = 500
const observerTimeouts = new Map()

const makeKey = (keySuffix) => `pure-ui.${keySuffix}`

const get = keySuffix => {
  const key = makeKey(keySuffix)
  let value = atom.config.get(key)

  if (value.toRGBAString) value = new Color(value.toRGBAString())

  return value
}

const makeObserver = ({callback, delayed}) => {
  const observerId = Math.random()

  return value => {
    if (value.toRGBAString) value = new Color(value.toRGBAString())
    const boundCallback = () => callback(value)

    if (delayed && data.themeIsActive) {
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
