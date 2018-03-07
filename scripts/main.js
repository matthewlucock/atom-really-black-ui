'use strict'

const config = require('./config')
const manageBackgroundImages = require('./backgroundImages')
const styleInjection = require('./styleInjection')
const util = require('./util')

const activate = () => {
  config.activate()
  styleInjection.activate()
  manageBackgroundImages.activate()
  util.themeIsActive = true
}

const deactivate = () => {
  config.deactivate()
  styleInjection.deactivate()
  manageBackgroundImages.deactivate()
  util.themeIsActive = false
}

module.exports = {activate, deactivate}
