'use strict'

const styleInjection = require('../styleInjection')
const util = require('../util')

const timeoutDuration = 500

const wrapCallback = ({callback, sync}) => {
  return value => {
    callback(value)

    if (util.themeIsActive) {
      styleInjection.injectStyles()
      if (sync) styleInjection.writeVariables()
    }
  }
}

module.exports = ({callback, delayed, sync}) => {
  callback = wrapCallback({callback, sync})

  return value => {
    if (delayed && util.themeIsActive) {
      setTimeout(() => callback(value), timeoutDuration)
    } else {
      callback(value)
    }
  }
}
