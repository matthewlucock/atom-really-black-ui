'use strict'

const path = require('path')
const mem = require('mem')
const { BACKGROUND_IMAGES_DIRECTORY, fileURI } = require('../utilities')

module.exports = class BackgroundImage {
  /**
   * @param {string} directoryName
   * @param {string} fileName
   */
  constructor (directoryName, fileName) {
    this.directoryName = directoryName
    this.fileName = fileName
    this.load = mem(this.load)
  }

  get absolutePath () {
    return path.join(
      BACKGROUND_IMAGES_DIRECTORY,
      this.directoryName,
      this.fileName
    )
  }

  get uri () {
    return fileURI(this.absolutePath)
  }

  get cssURL () {
    return `url(${this.uri})`
  }

  /**
   * Load the image from the file system.
   * @async
   */
  load () {
    return new Promise(resolve => {
      const element = document.createElement('img')
      element.onload = resolve
      element.src = this.uri
    })
  }

  toJSON () {
    return { directoryName: this.directoryName, fileName: this.fileName }
  }
}
