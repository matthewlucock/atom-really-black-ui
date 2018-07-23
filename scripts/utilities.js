'use strict'

const path = require('path')

const THEME_PATH = path.resolve(atom.packages.resolvePackagePath('pure-ui'))

const BACKGROUND_IMAGES_DIRECTORY = path.join(THEME_PATH, 'background-images')
const BACKGROUND_IMAGES_VIEW_URI = `atom://pure-background-images`
const BACKGROUND_IMAGES_VIEW_CLASS = `pure-background-images-view`

const getFileUri = absolutePath => {
  absolutePath = absolutePath.replace(/\\/g, '/')
  return `file:///${absolutePath}`
}

const getCssUrl = url => `url(${url})`

const registerCommand = (commandName, callback) => {
  return atom.commands.add('atom-workspace', `pure:${commandName}`, callback)
}

module.exports = {
  THEME_PATH,
  BACKGROUND_IMAGES_DIRECTORY,
  BACKGROUND_IMAGES_VIEW_URI,
  BACKGROUND_IMAGES_VIEW_CLASS,
  getFileUri,
  getCssUrl,
  registerCommand,
  themeIsActive: false
}
