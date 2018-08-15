'use strict'

const path = require('path')

// The absolute path of the Pure directory in the file system.
// If Pure is located within process.cwd(), atom.packages.resolvePackagePath() // will return a relative path.
// Relative paths appear to be unsuitable for use in file URIs in some
// environments, and so path.resolve() ensures the path is always absolute.
const ROOT_PATH = path.resolve(atom.packages.resolvePackagePath('pure-ui'))

module.exports = {
  ROOT_PATH,
  BACKGROUND_IMAGES_DIRECTORY: path.join(ROOT_PATH, 'background-images'),
  BACKGROUND_IMAGES_VIEW_URI: 'atom://pure-background-images',
  BACKGROUND_IMAGES_VIEW_CLASS: 'pure-background-images-view',
  /**
   * Generate a file URI from a file path.
   * @param {string} filePath
   * @returns {string}
   * @example
   * fileURI('a/b/c') === fileURI('a\\b\\c') === 'file:///a/b/c'
   */
  fileURI (filePath) {
    // Backslashes cannot be used in file URIs, even on Windows.
    filePath = filePath.replace(/\\/g, '/')
    return `file:///${filePath}`
  },
  /**
   * A thin abstraction over atom.commands.add() to register commands.
   * @param {string} commandName The name of the command without 'pure:'.
   * @param {function} callback
   * @returns {Disposable}
   */
  registerCommand (commandName, callback) {
    return atom.commands.add('atom-workspace', `pure:${commandName}`, callback)
  }
}
