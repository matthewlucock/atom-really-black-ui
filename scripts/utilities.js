'use strict'

const path = require('path')

const THEME_PATH = path.resolve(atom.packages.resolvePackagePath('pure-ui'))

module.exports = {
  THEME_PATH,
  BACKGROUND_IMAGES_DIRECTORY: path.join(THEME_PATH, 'background-images'),
  BACKGROUND_IMAGES_VIEW_URI: 'atom://pure-background-images',
  BACKGROUND_IMAGES_VIEW_CLASS: 'pure-background-images-view',
  getCssUrl: url => `url(${url})`,
  getFileUri: absolutePath => {
    absolutePath = absolutePath.replace(/\\/g, '/')
    return `file:///${absolutePath}`
  },
  registerCommand: (commandName, callback) => {
    return atom.commands.add('atom-workspace', `pure:${commandName}`, callback)
  },
  themeIsActive: false
}
