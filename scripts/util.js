'use strict'

const path = require('path')

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

const getContrastingTextColor = backgroundColor => {
  return backgroundColor.isDark() ? WHITE : BLACK
}

const BACKGROUND_IMAGES_DIRECTORY = path.join(THEME_PATH, 'background-images')
const BACKGROUND_IMAGES_VIEW_URI = getAtomUri(
  `${SHORT_PACKAGE_NAME}-background-images`
)
const BACKGROUND_IMAGES_VIEW_CLASS = (
  `${SHORT_PACKAGE_NAME}-background-images-view`
)

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
  getContrastingTextColor,
  BACKGROUND_IMAGES_DIRECTORY,
  BACKGROUND_IMAGES_VIEW_URI,
  BACKGROUND_IMAGES_VIEW_CLASS,
  themeIsActive: false
}
