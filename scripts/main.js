'use strict'

const config = require('./config')
const manageBackgroundImages = require('./backgroundImages')
const styleInjection = require('./styleInjection')
const util = require('./util')

const activate = () => {
  config.activate()
  styleInjection.init()
  manageBackgroundImages.activate()
  util.themeHasActivated = true
}

const deactivate = () => {
  config.deactivate()
  styleInjection.styleElement.remove()
  manageBackgroundImages.deactivate()
  util.themeHasActivated = false
}

module.exports = {activate, deactivate}
