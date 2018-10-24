'use strict'

// This module provides an abstraction over atom.config.

// The duration in milliseconds of the settings delay.
const DELAY = 500

// Stores the current delay timeout ID of each callback so that currently
// running timeouts can be cancelled to ensure natural behaviour when changing
// settings.
const delayTimeouts = new Map()

// Whether or not config callbacks can currently run.
let callbacksDisabled = false

/**
 * Prefix a config key with the theme's base key path.
 * @param {string} keySuffix
 * @returns {string}
 * @example
 * makeKey('foo.bar') === 'pure-ui.foo.bar'
 */
const makeKey = keySuffix => `pure-ui.${keySuffix}`

/**
 * Get the value of a config key in the theme's key path.
 * @param {string} keySuffix
 * @returns The value returned by atom.config.get()
 */
const get = keySuffix => atom.config.get(makeKey(keySuffix))

/**
 * Wrap a callback for use in listener functions like atom.config.observe() or
 * atom.config.onDidChange().
 * @param {object} options
 * @param {function} options.callback The callback to wrap.
 * @param {boolean} options.delayed Whether the callback should be delayed.
 * @returns {function}
 */
const makeCallback = ({ callback, delayed }) => {
  // Used to identify the delay timeout of the callback.
  const callbackID = Math.random()

  return value => {
    if (callbacksDisabled) return

    const timeoutCallback = () => {
      delayTimeouts.delete(callbackID)
      callback(value)
    }

    if (delayed && get('general.settingsDelay')) {
      // Cancel the timeout that is already running if there is one to ensure
      // natural behaviour when changing settings.
      clearTimeout(delayTimeouts.get(callbackID))
      const timeoutID = setTimeout(timeoutCallback, DELAY)
      delayTimeouts.set(callbackID, timeoutID)
    } else {
      timeoutCallback()
    }
  }
}

/**
 * Wrap a config listener function like atom.config.observe() or
 * atom.config.onDidChange() for use in the theme.
 * @param {function} fn
 * @returns {function}
 */
const makeListenFunction = fn => {
  fn = fn.bind(atom.config)

  return (keySuffix, callbackConfig) => {
    return fn(makeKey(keySuffix), makeCallback(callbackConfig))
  }
}

module.exports = {
  get,
  /**
   * Set the value of a config key in the theme's key path.
   * @param {string} keySuffix
   * @param value
   */
  set (keySuffix, value) {
    atom.config.set(makeKey(keySuffix), value)
  },
  onDidChange: makeListenFunction(atom.config.onDidChange),
  observe: makeListenFunction(atom.config.observe),
  disableCallbacks () {
    callbacksDisabled = true
  },
  enableCallbacks () {
    callbacksDisabled = false
  }
}
