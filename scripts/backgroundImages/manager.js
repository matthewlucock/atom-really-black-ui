'use strict'

const {EventEmitter} = require('events')
const path = require('path')
const {Disposable} = require('atom')
const {createElement} = require('docrel')
const fse = require('fs-extra')
const mem = require('mem')
const randomItem = require('random-item')
const BackgroundImage = require('./image')
const {BACKGROUND_IMAGES_DIRECTORY} = require('../utilities')
const config = require('../config')

const SELECTED_IMAGE_JSON_PATH = path.join(
  BACKGROUND_IMAGES_DIRECTORY,
  'selected.json'
)
const BACKGROUND_ANIMATING_CLASS = 'pure-background-image-animating'

/**
 * @param {BackgroundImage} image
 * @returns {string}
 */
const getBackgroundImageCss = image => {
  return `body {background-image: ${image.cssURL}}`
}

/**
 * Read a subdirectory of background images and create an array of
 * BackgroundImage instances.
 * @param {string} directoryName
 * @returns {Promise} Promise representing the array of BackgroundImages.
 */
const getDirectory = async directoryName => {
  const directoryPath = path.join(BACKGROUND_IMAGES_DIRECTORY, directoryName)
  await fse.ensureDir(directoryPath)
  const fileNames = await fse.readdir(directoryPath)

  return fileNames.map(fileName => {
    return new BackgroundImage(directoryName, fileName)
  })
}

module.exports = class BackgroundImageManager {
  constructor () {
    this.emitter = new EventEmitter()
    this.styleElement = createElement('style')
    this.animationElement = createElement('div', {
      class: 'pure-background-image-animation'
    })
    this._animating = false
    this.getDirectory = mem(getDirectory)
  }

  get animating () {
    return this._animating
  }

  set animating (value) {
    document.body.classList.toggle(BACKGROUND_ANIMATING_CLASS, value)
    this._animating = value
  }

  /**
   * Load and return the custom images directory if it contains any images,
   * or the default images directory otherwise.
   * @returns {Promise} Promise representing the array of BackgroundImages.
   */
  async optionallyGetCustomImages () {
    const customImages = await this.getDirectory('custom')
    if (customImages.length) return customImages
    return this.getDirectory('default')
  }

  /**
   * Randomly select an image from the provided set of images, provided it isn't
   * already selected.
   * @param {object} options
   * @param {Array#BackgroundImage} options.images The images to select from.
   * @param {BackgroundImage} options.currentImage
   */
  async selectRandomImage ({images, currentImage}) {
    images = images.filter(image => image !== currentImage)

    await this.select({
      image: images.length ? randomItem(images) : currentImage,
      write: true
    })
  }

  /**
   * @param {object} options
   * @param {BackgroundImage} options.image
   * @param {boolean} animateOut If true, the image fades out instead of in.
   */
  async animate ({image, animateOut}) {
    const opacity = animateOut ? [1, 0] : [0, 1]

    await image.load()

    this.animationElement.style.backgroundImage = image.cssURL
    this.animating = true
    const animation = this.animationElement.animate({opacity}, {
      duration: 1000,
      fill: 'forwards'
    })
    await animation.finished
    this.animating = false
  }

  /**
   * @param {object} options
   * @param {BackgroundImage} options.image
   * @param {boolean} options.write
   * @emits BackgroundImagesManager#select
   * @emits BackgroundImagesManager#deselect
   */
  async select ({image, write}) {
    if (this.selectedImage && !this.selectedImage.deleted) {
      /**
       * @event BackgroundImagesManager#deselect
       * @type {BackgroundImage}
       */
      this.emitter.emit('deselect', this.selectedImage)
    }

    this.selectedImage = image

    /**
     * @event BackgroundImagesManager#select
     * @type {BackgroundImage}
     */
    this.emitter.emit('select', image)

    if (config.get('imageBackground.animate')) await this.animate({image})
    this.styleElement.textContent = getBackgroundImageCss(image)

    if (write) await fse.writeJson(SELECTED_IMAGE_JSON_PATH, image)
  }

  /**
   * @param {string} sourcePath
   * @emits BackgroundImagesManager#addCustomImage
   */
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

    /**
     * @event BackgroundImagesManager#addCustomImage
     * @type {BackgroundImage}
     */
    this.emitter.emit('addCustomImage', image)
  }

  /**
   * @param {BackgroundImage} image
   * @emits BackgroundImagesManager#deleteCustomImage
   * @throws Throws an error when the image is not a custom image.
   */
  async deleteCustomImage (image) {
    if (image.directoryName !== 'custom') {
      throw new Error('Only custom images can be deleted.')
    }

    await fse.remove(image.absolutePath)

    const customImages = await this.getDirectory('custom')
    customImages.splice(customImages.indexOf(image), 1)

    image.deleted = true

    /**
     * @event BackgroundImagesManager#deleteCustomImage
     * @type {BackgroundImage}
     */
    this.emitter.emit('deleteCustomImage', image)

    if (image === this.selectedImage) {
      this.selectRandomImage({images: await this.optionallyGetCustomImages()})
    }
  }

  /**
   * @returns {Promise} Promise representing the retrieved image.
   */
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

  /**
   * @returns {Promise} Promise representing an array of BackgroundImages.
   */
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

  /**
   * @returns {Disposable}
   */
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
