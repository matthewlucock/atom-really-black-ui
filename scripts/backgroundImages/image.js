'use strict'

const path = require('path')

const memoize = require('mem')

const {BACKGROUND_IMAGES_DIRECTORY} = require('../data')
const utilities = require('../utilities')

module.exports = class BackgroundImage {
  constructor (directoryName, fileName) {
    this.directoryName = directoryName
    this.fileName = fileName
    this.load = memoize(this.load)
  }

  get absolutePath () {
    return path.join(
      BACKGROUND_IMAGES_DIRECTORY,
      this.directoryName,
      this.fileName
    )
  }

  get uri () {
    return utilities.getFileUri(this.absolutePath)
  }

  load () {
    return new Promise(resolve => {
      const element = document.createElement('img')
      element.onload = () => resolve()
      element.src = this.uri
    })
  }

  toJSON () {
    return {directoryName: this.directoryName, fileName: this.fileName}
  }
}
