'use strict'

const path = require('path')

const fse = require('fs-extra')
const memoize = require('mem')
const randomItem = require('random-item')

const {
  BackgroundImage,
  BACKGROUND_IMAGES_DIRECTORY
} = require('./backgroundImage')
const TemporaryBackground = require('./temporaryBackground')
const styleInjection = require('../styleInjection')

const DEFAULT_SUBDIRECTORY = 'default'
const SELECTED_DATA_PATH = path.join(
  BACKGROUND_IMAGES_DIRECTORY,
  'selected.json'
)

class BackgroundImageManager {
  constructor () {
    this._temporaryBackground = new TemporaryBackground()
    this._loadSubdirectory = memoize(this._loadSubdirectory)
  }

  async _loadSubdirectory (subdirectory) {
    const directoryPath = path.join(BACKGROUND_IMAGES_DIRECTORY, subdirectory)
    const fileNames = await fse.readdir(directoryPath)

    return fileNames.map(fileName => {
      const filePath = path.join(subdirectory, fileName)
      return new BackgroundImage(filePath)
    })
  }

  loadDefaultImages () {
    return this._loadSubdirectory(DEFAULT_SUBDIRECTORY)
  }

  async _setBaseDefaultImage () {
    const defaultImages = await this.loadDefaultImages()
    const imageToSelect = randomItem(defaultImages)
    await this.select(imageToSelect)
  }

  async _getImageFromPath (filePath) {
    const defaultImages = await this.loadDefaultImages()
    return defaultImages.find(image => image.filePath === filePath)
  }

  async _getSelectedImage () {
    if (this._selectedImage) return this._selectedImage

    let selectedImagePath

    try {
      selectedImagePath = await fse.readJson(SELECTED_DATA_PATH)
    } catch (_) {}

    if (selectedImagePath) return this._getImageFromPath(selectedImagePath)
  }

  async activate () {
    document.body.append(this._temporaryBackground.element)

    this._temporaryBackground.on('animated', image => {
      this._animationCallback(image)
    })

    const selectedImage = await this._getSelectedImage()

    if (selectedImage) {
      this._applySelectedImage(selectedImage)
    } else {
      await this._setBaseDefaultImage()
    }
  }

  async select (image) {
    await fse.writeJson(SELECTED_DATA_PATH, image.filePath)
    this._applySelectedImage(image)
  }

  _applySelectedImage (image) {
    if (this._selectedImage) this._selectedImage.deselect()
    this._selectedImage = image
    image.select()
    this._temporaryBackground.animate(image)
  }

  _animationCallback (image) {
    styleInjection.variables.unsynced['background-image-uri'] = image.uri
    styleInjection.injectStyles()
  }
}

module.exports = BackgroundImageManager
