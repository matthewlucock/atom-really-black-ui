'use strict'

const {Disposable} = require('atom')
const {EventEmitter} = require('events')
const path = require('path')
const {createElement} = require('docrel')
const fse = require('fs-extra')
const mem = require('mem')
const randomItem = require('random-item')
const BackgroundImage = require('./image')
const {BACKGROUND_IMAGES_DIRECTORY, getCssUrl} = require('../utilities')
const config = require('../config')

const SELECTED_IMAGE_JSON_PATH = path.join(
  BACKGROUND_IMAGES_DIRECTORY,
  'selected.json'
)

const getBackgroundImageCss = image => {
  return `body {background-image: ${getCssUrl(image.uri)}}`
}

module.exports = class BackgroundImageManager {
  constructor () {
    this.emitter = new EventEmitter()
    this.styleElement = createElement('style')
    this.animationElement = createElement('div', {
      class: 'pure-background-image-animation'
    })
    this.getDirectory = mem(this.getDirectory)
  }

  async getDirectory (directoryName) {
    const directoryPath = path.join(BACKGROUND_IMAGES_DIRECTORY, directoryName)
    await fse.ensureDir(directoryPath)
    const fileNames = await fse.readdir(directoryPath)

    return fileNames.map(fileName => {
      return new BackgroundImage(directoryName, fileName)
    })
  }

  async optionallyGetCustomImages () {
    const customImages = await this.getDirectory('custom')
    if (customImages.length) return customImages
    return this.getDirectory('default')
  }

  async selectRandomImage ({images, currentImage}) {
    images = images.filter(image => image !== currentImage)

    await this.select({
      image: images.length ? randomItem(images) : currentImage,
      write: true
    })
  }

  async animate ({image, animateOut}) {
    const opacity = animateOut ? [1, 0] : [0, 1]

    await image.load()

    this.animationElement.style.backgroundImage = getCssUrl(image.uri)
    const animation = this.animationElement.animate({opacity}, {
      duration: 1000,
      fill: 'forwards'
    })
    await animation.finished
  }

  async select ({image, write}) {
    if (this.selectedImage && !this.selectedImage.deleted) {
      this.emitter.emit('deselect', this.selectedImage)
    }

    this.selectedImage = image
    this.emitter.emit('select', image)
    await this.animate({image})
    this.styleElement.textContent = getBackgroundImageCss(image)

    if (write) await fse.writeJson(SELECTED_IMAGE_JSON_PATH, image)
  }

  async addCustomImage (sourcePath) {
    const fileName = Math.random() + path.extname(sourcePath)
    const destinationPath = path.join(
      BACKGROUND_IMAGES_DIRECTORY,
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

    if (image === this.selectedImage) {
      this.selectRandomImage({images: await this.optionallyGetCustomImages()})
    }
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

  async getImagesToSelectNewImageFrom () {
    const selectNewImagesFrom = config.get(
      'imageBackground.selectNewImagesFrom'
    )

    if (selectNewImagesFrom === 'Default images') {
      return this.getDirectory('default')
    }

    if (selectNewImagesFrom === 'Custom images') {
      return this.optionallyGetCustomImages()
    }

    const [defaultImages, customImages] = await Promise.all([
      this.getDirectory('default'),
      this.getDirectory('custom')
    ])
    return [...defaultImages, ...customImages]
  }

  async handleImageSelectionOnActivation () {
    const selectNewImageOnActivation = config.get(
      'imageBackground.selectNewImageOnActivation'
    )
    const writtenSelectedImage = await this.getWrittenSelectedImage()

    if (!selectNewImageOnActivation && writtenSelectedImage) {
      await this.select({image: writtenSelectedImage})
    } else {
      await this.selectRandomImage({
        images: await this.getImagesToSelectNewImageFrom(),
        currentImage: writtenSelectedImage
      })
    }
  }

  activate () {
    document.body.append(this.animationElement)
    document.head.append(this.styleElement)

    this.handleImageSelectionOnActivation()

    return new Disposable(() => {
      this.animationElement.remove()
      this.styleElement.remove()
    })
  }
}
