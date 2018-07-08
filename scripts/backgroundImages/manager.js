'use strict'

const {Disposable} = require('atom')

const {EventEmitter} = require('events')
const path = require('path')

const fse = require('fs-extra')
const memoize = require('mem')
const randomItem = require('random-item')

const BackgroundImage = require('./image')
const AnimatingBackgroundImage = require('./animatingImage')
const config = require('../config')
const util = require('../util')

const SELECTED_IMAGE_JSON_PATH = path.join(
  util.BACKGROUND_IMAGES_DIRECTORY,
  'selected.json'
)

const SELECT_NEW_IMAGES_FROM = {
  default: 'Default images',
  custom: 'Custom images'
}

const getBackgroundImageCss = image => {
  return `body {background-image: ${util.getCssUrl(image.uri)}}`
}

module.exports = class BackgroundImageManager {
  constructor () {
    this.emitter = new EventEmitter()
    this.styleElement = document.createElement('style')
    this.animatingBackgroundImage = new AnimatingBackgroundImage()
    this.getDirectory = memoize(this.getDirectory)
  }

  async getDirectory (directoryName) {
    const directoryPath = path.join(
      util.BACKGROUND_IMAGES_DIRECTORY,
      directoryName
    )
    await fse.ensureDir(directoryPath)
    const fileNames = await fse.readdir(directoryPath)

    return fileNames.map(fileName => {
      return new BackgroundImage(directoryName, fileName)
    })
  }

  async getAllImages () {
    const [defaultImages, customImages] = await Promise.all([
      this.getDirectory('default'),
      this.getDirectory('custom')
    ])

    return [...defaultImages, ...customImages]
  }

  async getWrittenSelectedImage () {
    await fse.ensureFile(SELECTED_IMAGE_JSON_PATH)
    const selectedImageData = await fse.readJson(
      SELECTED_IMAGE_JSON_PATH,
      {throws: false}
    )

    if (!selectedImageData) return
    const {directoryName, fileName} = selectedImageData

    const images = await this.getDirectory(directoryName)
    return images.find(image => image.fileName === fileName)
  }

  async select ({image, write}) {
    if (this.selectedImage && !this.selectedImage.deleted) {
      this.emitter.emit('deselect', this.selectedImage)
    }

    this.selectedImage = image
    this.emitter.emit('select', image)

    await this.animatingBackgroundImage.animate({image})
    this.styleElement.textContent = getBackgroundImageCss(image)

    if (write) await fse.writeJson(SELECTED_IMAGE_JSON_PATH, image)
  }

  async getImagesToSelectNewImageFrom () {
    const selectNewImagesFrom = config.get(
      'imageBackgrounds.selectNewImagesFrom'
    )

    if (selectNewImagesFrom === SELECT_NEW_IMAGES_FROM.default) {
      return this.getDirectory('default')
    }

    if (selectNewImagesFrom === SELECT_NEW_IMAGES_FROM.custom) {
      const customImages = await this.getDirectory('custom')
      if (customImages.length) return customImages
    }

    return this.getAllImages()
  }

  async selectRandomNewImage (currentImage) {
    const imagesToSelectFrom = (await this.getImagesToSelectNewImageFrom())
      .filter(image => image !== currentImage)

    let image

    if (imagesToSelectFrom.length) {
      image = randomItem(imagesToSelectFrom)
    } else {
      image = currentImage
    }

    await this.select({image, write: true})
  }

  async addCustomImage (sourcePath) {
    const fileName = Math.random() + path.extname(sourcePath)
    const destinationPath = path.join(
      util.BACKGROUND_IMAGES_DIRECTORY,
      'custom',
      fileName
    )
    await fse.copy(sourcePath, destinationPath)

    const image = new BackgroundImage('custom', fileName)

    const customImages = await this.getDirectory('custom')
    customImages.push(image)

    this.emitter.emit('addCustomImage', image)
  }

  async deleteCustomImage (image) {
    if (image.directoryName !== 'custom') {
      throw new Error('Only custom images can be deleted.')
    }

    await fse.remove(image.absolutePath)

    const customImages = await this.getDirectory('custom')
    customImages.splice(customImages.indexOf(image), 1)

    image.deleted = true
    this.emitter.emit('deleteCustomImage', image)

    if (image === this.selectedImage) this.selectRandomNewImage()
  }

  async handleImageSelectionOnActivation () {
    const selectNewImageOnActivation = config.get(
      'imageBackgrounds.selectNewImageOnActivation'
    )
    const writtenSelectedImage = await this.getWrittenSelectedImage()

    if (!selectNewImageOnActivation && writtenSelectedImage) {
      await this.select({image: writtenSelectedImage})
    } else {
      await this.selectRandomNewImage(writtenSelectedImage)
    }
  }

  activate () {
    document.body.append(this.animatingBackgroundImage.element)
    document.head.append(this.styleElement)

    this.handleImageSelectionOnActivation()

    return new Disposable(() => {
      this.animatingBackgroundImage.element.remove()
      this.styleElement.remove()
    })
  }
}
