'use strict'

const { EventEmitter } = require('events')
const path = require('path')
const { Disposable, CompositeDisposable } = require('atom')
const { createElement } = require('docrel')
const fse = require('fs-extra')
const mem = require('mem')
const randomItem = require('random-item')
const BackgroundImage = require('./image')
const { BACKGROUND_IMAGES_DIRECTORY } = require('../utilities')
const config = require('../config')

const SELECTED_IMAGE_JSON_PATH = path.join(
  BACKGROUND_IMAGES_DIRECTORY,
  'selected.json'
)
const BACKGROUND_ANIMATING_CLASS = 'pure-background-image-animating'

const ONE_HOUR = 60 * 60 * 1000
const SLIDESHOW_DURATION_STRINGS = {
  '30 minutes': ONE_HOUR / 2,
  '1 hour': ONE_HOUR,
  '2 hours': 2 * ONE_HOUR,
  '4 hours': 4 * ONE_HOUR,
  '6 hours': 6 * ONE_HOUR
}

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
  async selectRandomImage (options) {
    if (!options) options = {}
    let { images, currentImage, slowAnimation } = options
    if (!images) images = await this.getImagesToSelectNewImageFrom()
    if (!currentImage) currentImage = this.selectedImage

    images = images.filter(image => image !== currentImage)

    await this.select({
      image: images.length ? randomItem(images) : currentImage,
      slowAnimation,
      write: true
    })
  }

  /**
   * @param {object} options
   * @param {BackgroundImage} options.image
   * @param {boolean} slow If true, significantly increase the duration of the
   * animation.
   * @param {boolean} animateOut If true, the image fades out instead of in.
   */
  async animate ({ image, slow, animateOut }) {
    const opacity = animateOut ? [1, 0] : [0, 1]

    let duration = 1000
    if (slow) duration *= 10

    await image.load()

    this.animationElement.style.backgroundImage = image.cssURL
    this.animating = true
    const animation = this.animationElement.animate({ opacity }, {
      duration,
      fill: 'forwards'
    })
    await animation.finished
    this.animating = false
  }

  /**
   * @param {object} options
   * @param {BackgroundImage} options.image
   * @param {boolean} options.slowAnimation
   * @param {boolean} options.write
   * @emits BackgroundImagesManager#select
   * @emits BackgroundImagesManager#deselect
   */
  async select ({ image, slowAnimation, write }) {
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

    if (config.get('imageBackground.animate')) {
      document.body.append(this.animationElement)
      await this.animate({ image, slow: slowAnimation })
    }
    this.styleElement.textContent = getBackgroundImageCss(image)
    this.animationElement.remove()

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
      this.selectRandomImage({ images: await this.optionallyGetCustomImages() })
    }
  }

  /**
   * @returns {Promise} Promise representing the retrieved image.
   */
  async getWrittenSelectedImage () {
    await fse.ensureFile(SELECTED_IMAGE_JSON_PATH)
    const selectedImageData = await fse.readJson(
      SELECTED_IMAGE_JSON_PATH,
      { throws: false }
    )

    if (!selectedImageData) return
    const { directoryName, fileName } = selectedImageData

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
    const selectNewImageOnLaunch = config.get(
      'imageBackground.selectNewImageOnLaunch'
    )
    const writtenSelectedImage = await this.getWrittenSelectedImage()

    if (!selectNewImageOnLaunch && writtenSelectedImage) {
      await this.select({ image: writtenSelectedImage })
    } else {
      await this.selectRandomImage({ currentImage: writtenSelectedImage })
    }
  }

  async applySlideshowDuration () {
    const durationString = config.get('imageBackground.slideshowDuration')
    const duration = SLIDESHOW_DURATION_STRINGS[durationString]

    clearInterval(this.slideshowIntervalID)
    this.slideshowIntervalID = setInterval(
      () => this.selectRandomImage({ slowAnimation: true }),
      duration
    )
  }

  bindConfigListeners () {
    return new CompositeDisposable(
      config.observe('imageBackground.slideshow', {
        callback: slideshow => {
          if (slideshow) {
            this.applySlideshowDuration()
          } else {
            clearInterval(this.slideshowIntervalID)
          }
        }
      }),
      config.onDidChange('imageBackground.slideshowDuration', {
        callback: () => {
          this.selectRandomImage()
          this.applySlideshowDuration()
        }
      })
    )
  }

  /**
   * @returns {CompositeDisposable}
   */
  activate () {
    document.head.append(this.styleElement)

    this.handleImageSelectionOnActivation()

    return new CompositeDisposable(
      this.bindConfigListeners(),
      new Disposable(async () => {
        clearInterval(this.slideshowIntervalID)

        document.body.append(this.animationElement)
        await this.animate({ image: this.selectedImage, out: true })
        this.animationElement.remove()

        this.styleElement.remove()
      })
    )
  }
}
