'use strict'

const path = require('path')

const memoize = require('mem')

const util = require('../util')

const BACKGROUND_IMAGES_DIRECTORY = util.getPathInTheme('background-images')

const CLASS_NAMES = {
  thumbnail: 'pure-background-image-thumbnail',
  thumbnailContainer: 'pure-background-image-thumbnail-container',
  selected: 'pure-background-image-thumbnail-container-selected'
}

class BackgroundImage {
  constructor (relativePath) {
    this.relativePath = relativePath
    this.absolutePath = path.join(BACKGROUND_IMAGES_DIRECTORY, relativePath)
    this.uri = util.getFileUri(this.absolutePath)

    this.element = document.createElement('img')
    this.thumbnail = this._makeThumbnail()

    this.load = memoize(this.load)
    this.load()
  }

  load () {
    return new Promise((resolve, reject) => {
      this.element.onload = () => resolve()
      this.element.onerror = () => reject(new Error())
      this.element.src = this.uri
    })
  }

  _makeThumbnail () {
    const container = document.createElement('li')
    container.className = CLASS_NAMES.thumbnailContainer

    this.element.className = CLASS_NAMES.thumbnail
    this.element.setAttribute('data-relative-path', this.relativePath)
    container.append(this.element)

    return container
  }

  select () {
    this.thumbnail.classList.add(CLASS_NAMES.selected)
  }

  deselect () {
    this.thumbnail.classList.remove(CLASS_NAMES.selected)
  }
}

module.exports = {
  BackgroundImage,
  BACKGROUND_IMAGES_DIRECTORY,
  THUMBNAIL_CLASS_NAME: CLASS_NAMES.thumbnail
}
