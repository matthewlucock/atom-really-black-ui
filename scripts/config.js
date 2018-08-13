'use strict'

const TIMEOUT_DURATION = 500
const timeouts = new Map()

const makeKey = keySuffix => `pure-ui.${keySuffix}`
const get = keySuffix => atom.config.get(makeKey(keySuffix))
const set = (keySuffix, value) => atom.config.set(makeKey(keySuffix), value)

let callbacksLocked = false

const makeCallback = ({callback, delayed}) => {
  const callbackID = Math.random()

  return value => {
    if (callbacksLocked) return

    const timeoutCallback = () => {
      timeouts.delete(callbackID)
      callback(value)
    }

    if (delayed && get('general.settingsDelay')) {
      clearTimeout(timeouts.get(callbackID))
      const timeoutID = setTimeout(timeoutCallback, TIMEOUT_DURATION)
      timeouts.set(callbackID, timeoutID)
    } else {
      timeoutCallback()
    }
  }
}

const makeListenFunction = fn => {
  fn = fn.bind(atom.config)

  return (keySuffix, callbackConfig) => {
    return fn(makeKey(keySuffix), makeCallback(callbackConfig))
  }
}

const onDidChange = makeListenFunction(atom.config.onDidChange)
const observe = makeListenFunction(atom.config.observe)

const lockCallbacks = () => {
  callbacksLocked = true
}

const unlockCallbacks = () => {
  callbacksLocked = false
}

module.exports = {
  get,
  set,
  onDidChange,
  observe,
  lockCallbacks,
  unlockCallbacks
}
