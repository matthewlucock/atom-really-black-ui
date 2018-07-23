'use strict'

const getFileUri = absolutePath => {
  absolutePath = absolutePath.replace(/\\/g, '/')
  return `file:///${absolutePath}`
}

const getCssUrl = url => `url(${url})`

const registerCommand = (commandName, callback) => {
  return atom.commands.add('atom-workspace', `pure:${commandName}`, callback)
}

module.exports = {
  getFileUri,
  getCssUrl,
  registerCommand
}
