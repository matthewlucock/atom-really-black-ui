'use strict'

const path = require('path')

const ROOT_PATH = path.resolve(atom.packages.resolvePackagePath('pure-ui'))

module.exports = {
  ROOT_PATH,
  BACKGROUND_IMAGES_DIRECTORY: path.join(ROOT_PATH, 'background-images'),
  BACKGROUND_IMAGES_VIEW_URI: 'atom://pure-background-images',
  BACKGROUND_IMAGES_VIEW_CLASS: 'pure-background-images-view',
  fileURI: absolutePath => {
    absolutePath = absolutePath.replace(/\\/g, '/')
    return `file:///${absolutePath}`
  },
  registerCommand: (commandName, callback) => {
    return atom.commands.add('atom-workspace', `pure:${commandName}`, callback)
  }
}
