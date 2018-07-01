'use strict'

const Color = require('color')

const SHORT_PACKAGE_NAME = 'pure'
const LONG_PACKAGE_NAME = `${SHORT_PACKAGE_NAME}-ui`

const THEME_PATH = atom.packages.resolvePackagePath(LONG_PACKAGE_NAME)

const BLACK = Color('black')
const WHITE = Color('white')

const getAtomUri = uriFragment => `atom://${uriFragment}`

const getFileUri = absolutePath => {
  absolutePath = absolutePath.replace(/\\/g, '/')
  return `file:///${absolutePath}`
}

const getCssUrl = url => `url(${url})`

const getPackageCommandName = name => `${SHORT_PACKAGE_NAME}:${name}`

const getTextColorFromBackgroundColor = backgroundColor => {
  return backgroundColor.isDark() ? WHITE : BLACK
}

module.exports = {
  SHORT_PACKAGE_NAME,
  LONG_PACKAGE_NAME,
  BLACK,
  WHITE,
  THEME_PATH,
  getAtomUri,
  getFileUri,
  getCssUrl,
  getPackageCommandName,
  getTextColorFromBackgroundColor,
  themeIsActive: false
}
