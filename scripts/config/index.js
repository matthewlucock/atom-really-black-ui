'use strict'

const Color = require('color')

const data = require('../data')
const styleVariables = require('../styleVariables')

const OBSERVER_TIMEOUT_DURATION = 500
const observerTimeouts = new Map()

const makeKey = (keySuffix) => `pure-ui.${keySuffix}`

const get = keySuffix => {
  const key = makeKey(keySuffix)
  let value = atom.config.get(key)

  if (value.toRGBAString) value = new Color(value.toRGBAString())

  return value
}

const wrapObserverCallback = ({callback, updateStyles}) => {
  return value => {
    callback(value)

    if (data.themeIsActive && updateStyles !== false) {
      styleVariables.inject()
      styleVariables.write()
    }
  }
}

const makeObserver = ({callback, delayed, updateStyles}) => {
  callback = wrapObserverCallback({callback, updateStyles})
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
