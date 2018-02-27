'use strict'

const VIEW_URI = 'atom://pure-background-images'
const VIEW_TITLE = 'Background images'

const CLASS_NAMES = {
  panel: 'pure-background-images-view',
  imagesList: 'pure-background-images-list'
}

class BackgroundImagesView {
  constructor (manager) {
    this.manager = manager

    this.element = document.createElement('div')
    this.element.className = CLASS_NAMES.panel

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

  _makeImagesList () {
    const imagesList = document.createElement('ul')
    imagesList.className = CLASS_NAMES.imagesList
    return imagesList
  }

  async load () {
    const defaultImages = await this.manager.loadDefaultImages()

    for (const image of defaultImages) {
      this.defaultImagesList.append(image.thumbnail)
      image.thumbnail.addEventListener('click', () => {
        this.manager.select(image)
      })
    }
  }
}

module.exports = {BackgroundImagesView, VIEW_URI}
