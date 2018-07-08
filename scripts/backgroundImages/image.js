'use strict'

const path = require('path')

const util = require('../util')

module.exports = class BackgroundImage {
  constructor (directoryName, fileName) {
    this.directoryName = directoryName
    this.fileName = fileName
  }

  get absolutePath () {
    return path.join(
      util.BACKGROUND_IMAGES_DIRECTORY,
      this.directoryName,
      this.fileName
    )
  }

  get uri () {
    return util.getFileUri(this.absolutePath)
  }

  toJSON () {
    return {directoryName: this.directoryName, fileName: this.fileName}
  }
}
