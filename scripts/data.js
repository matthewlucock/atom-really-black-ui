'use strict'

const path = require('path')

exports.THEME_PATH = path.resolve(atom.packages.resolvePackagePath('pure-ui'))

exports.BACKGROUND_IMAGES_DIRECTORY = path.join(
  exports.THEME_PATH,
  'background-images'
)
exports.BACKGROUND_IMAGES_VIEW_URI = `atom://pure-background-images`
exports.BACKGROUND_IMAGES_VIEW_CLASS = `pure-background-images-view`

exports.themeIsActive = false
