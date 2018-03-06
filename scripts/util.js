'use strict'

const path = require('path')

const Color = require('color')

const BLACK = Color('black')
const WHITE = Color('white')

const handleAtomColor = atomColor => Color(atomColor.toHexString())

const getMainTextColorFromBackgroundColor = backgroundColor => {
  return backgroundColor.isDark() ? WHITE : BLACK
}

const getFileUri = absolutePath => {
  absolutePath = absolutePath.replace(/\\/g, '/')
  return `file:///${absolutePath}`
}

const getPathInTheme = path.join.bind(
  undefined,
  atom.packages.resolvePackagePath('pure-ui')
)

module.exports = {
  handleAtomColor,
  getMainTextColorFromBackgroundColor,
  getFileUri,
  getPathInTheme,
  themeHasActivated: false
}
