'use strict'

const styleInjection = require('./styleInjection')
const util = require('./util')

const timeouts = new Map()
const timeoutDuration = 500

const makeCallbackWrapper = callback => {
  return value => {
    callback(value)

    if (util.themeHasActivated) {
      styleInjection.injectStyles()
      styleInjection.updateStyleVariablesFile()
    }
  }
}

module.exports = options => {
  const callbackWrapper = makeCallbackWrapper(options.callback)
  const observerID = Math.random()

  return value => {
    const boundCallbackWrapper = callbackWrapper.bind(undefined, value)

    if (options.hasTimeout && util.themeHasActivated) {
      clearTimeout(timeouts.get(observerID))

      const timeoutID = setTimeout(boundCallbackWrapper, timeoutDuration)
      timeouts.set(observerID, timeoutID)
    } else {
      boundCallbackWrapper()
    }
  }
}
