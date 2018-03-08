'use strict'

const path = require('path')

const Color = require('color')

const SHORT_PACKAGE_NAME = 'pure'
const LONG_PACKAGE_NAME = `${SHORT_PACKAGE_NAME}-ui`

const THEME_PATH = atom.packages.resolvePackagePath(LONG_PACKAGE_NAME)

const BLACK = Color('black')
const WHITE = Color('white')

const getPathInTheme = path.join.bind(undefined, THEME_PATH)

const getAtomUri = uriFragment => `atom://${uriFragment}`

const getFileUri = absolutePath => {
  absolutePath = absolutePath.replace(/\\/g, '/')
  return `file:///${absolutePath}`
}

const getCssUrl = url => `url(${url})`

const getPackageCommandName = name => `${SHORT_PACKAGE_NAME}:${name}`

const wrapAtomColor = atomColor => Color(atomColor.toHexString())

const getTextColorFromBackgroundColor = backgroundColor => {
  return backgroundColor.isDark() ? WHITE : BLACK
}

module.exports = {
  SHORT_PACKAGE_NAME,
  LONG_PACKAGE_NAME,
  BLACK,
  WHITE,
  getPathInTheme,
  getAtomUri,
  getFileUri,
  getCssUrl,
  getPackageCommandName,
  wrapAtomColor,
  getTextColorFromBackgroundColor,
  themeIsActive: false
}
