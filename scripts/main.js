'use strict'

const config = require('./config')
const styleInjection = require('./styleInjection')
const util = require('./util')

const activate = () => {
  config.activate()
  styleInjection.init()
  util.themeHasActivated = true
}

const deactivate = () => {
  config.deacticate()
  styleInjection.styleElement.remove()
  util.themeHasActivated = false
}

module.exports = {activate, deactivate}
