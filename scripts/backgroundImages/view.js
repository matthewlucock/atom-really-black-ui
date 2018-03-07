'use strict'

const {THUMBNAIL_CLASS_NAME} = require('./backgroundImage')
const util = require('../util')

const VIEW_URI = util.getAtomUri(`${util.SHORT_PACKAGE_NAME}-background-images`)
const VIEW_TITLE = 'Background images'

const CLASS_NAMES = {
  view: `${util.SHORT_PACKAGE_NAME}-background-images-view`,
  imagesList: `${util.SHORT_PACKAGE_NAME}-background-images-list`
}

class BackgroundImagesView {
  constructor (manager) {
    this.manager = manager

    this.element = document.createElement('div')
    this.element.className = CLASS_NAMES.view

    this.defaultImagesList = this._makeImagesList()
    this.element.append(this.defaultImagesList)

    this.load()
  }

  getURI () {
    return VIEW_URI
  }

  getTitle () {
    return VIEW_TITLE
  }

  async _imagesListClickListener ({target}) {
    if (!target.classList.contains(THUMBNAIL_CLASS_NAME)) return

    const relativePath = target.getAttribute('data-relative-path')
    const image = await this.manager.getImageFromRelativePath(relativePath)
    this.manager.select(image)
  }

  _makeImagesList () {
    const imagesList = document.createElement('ul')
    imagesList.className = CLASS_NAMES.imagesList
    imagesList.addEventListener(
      'click',
      this._imagesListClickListener.bind(this)
    )

    return imagesList
  }

  async load () {
    const defaultImages = await this.manager.loadDefaultImages()

    for (const image of defaultImages) {
      this.defaultImagesList.append(image.thumbnail)
    }
  }
}

module.exports = {BackgroundImagesView, VIEW_URI}
