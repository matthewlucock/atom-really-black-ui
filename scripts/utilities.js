'use strict'

const Color = require('color')

const BLACK = new Color('black')
const WHITE = new Color('white')

const getFileUri = absolutePath => {
  absolutePath = absolutePath.replace(/\\/g, '/')
  return `file:///${absolutePath}`
}

const getCssUrl = url => `url(${url})`

const getContrastingTextColor = backgroundColor => {
  return backgroundColor.isDark() ? WHITE : BLACK
}

const registerCommand = (commandName, callback) => {
  return atom.commands.add('atom-workspace', `pure:${commandName}`, callback)
}

module.exports = {
  BLACK,
  getFileUri,
  getCssUrl,
  getContrastingTextColor,
  registerCommand
}
