'use strict'

const {Disposable, CompositeDisposable} = require('atom')
const {createElement} = require('docrel')
const BackgroundImageThumbnail = require('./thumbnail')
const {
  BACKGROUND_IMAGES_VIEW_CLASS,
  BACKGROUND_IMAGES_VIEW_URI
} = require('../utilities')

const CUSTOM_CONTAINER_CLASS = `${BACKGROUND_IMAGES_VIEW_CLASS}-custom`
const LOADING_CLASS = `${BACKGROUND_IMAGES_VIEW_CLASS}-loading`
const DROP_ZONE_CLASS = `${CUSTOM_CONTAINER_CLASS}-drop-zone`
const DROP_ZONE_ACTIVE_CLASS = `${DROP_ZONE_CLASS}-active`

const SUPPORTED_FILE_TYPES = ['image/jpeg', 'image/png']
const MAXIMUM_FILE_SIZE = 20 * 1000 * 1000

module.exports = class BackgroundImagesView {
  constructor (manager) {
    this.manager = manager
    this.thumbnails = {default: [], custom: []}
    this.fileInput = createElement('input', {
      attrs: {
        type: 'file',
        accept: SUPPORTED_FILE_TYPES.join(', '),
        multiple: true
      },
      events: {
        change: () => this.addCustomImagesFromFileList(this.fileInput.files)
      }
    })
    this.disposables = new CompositeDisposable()

    this.defaultList = createElement('div', {
      classList: [`${BACKGROUND_IMAGES_VIEW_CLASS}-default-list`, LOADING_CLASS]
    })
    this.customList = createElement('div', {
      class: `${CUSTOM_CONTAINER_CLASS}-list`
    })

    const browseButton = createElement(
      'button',
      {
        classList: ['btn', `${CUSTOM_CONTAINER_CLASS}-browse-button`],
        events: {click: () => this.fileInput.click()}
      },
      [
        createElement('span', {classList: ['icon', 'icon-file-media']}),
        document.createTextNode('Browse')
      ]
    )

    const addImageMessage = createElement(
      'div',
      {class: `${CUSTOM_CONTAINER_CLASS}-add-image-message`},
      [
        document.createTextNode('Drag images here or'),
        browseButton,
        document.createTextNode('for them.')
      ]
    )

    this.dropZone = createElement('div', {class: DROP_ZONE_CLASS})

    this.customContainer = createElement(
      'div',
      {classList: [CUSTOM_CONTAINER_CLASS, LOADING_CLASS]},
      [this.customList, addImageMessage, this.dropZone]
    )

    this.element = createElement(
      'div',
      {class: BACKGROUND_IMAGES_VIEW_CLASS},
      [
        createElement('h2', {textContent: 'Default images'}),
        this.defaultList,
        createElement('h2', {textContent: 'Custom images'}),
        this.customContainer
      ]
    )

    this.load()
  }

  getURI () {
    return BACKGROUND_IMAGES_VIEW_URI
  }

  getTitle () {
    return 'Background images'
  }

  getIconName () {
    return 'file-media'
  }

  makeThumbnail ({image, deletable}) {
    const thumbnail = new BackgroundImageThumbnail({image, deletable})

    thumbnail.emitter.on('select', () => {
      this.manager.select({image, write: true})
    })
    thumbnail.emitter.on('delete', () => this.manager.deleteCustomImage(image))

    return thumbnail
  }

  addThumbnail ({image, deletable, thumbnails, list}) {
    const thumbnail = this.makeThumbnail({image, deletable})
    thumbnails.push(thumbnail)
    list.append(thumbnail.element)
    return thumbnail
  }

  getThumbnailFromImage (image) {
    return this.thumbnails[image.directoryName].find(thumbnail => {
      return thumbnail.image.fileName === image.fileName
    })
  }

  async loadList ({directoryName, list, container, deletable}) {
    const images = await this.manager.getDirectory(directoryName)
    const thumbnails = this.thumbnails[directoryName]

    for (const image of images) {
      this.addThumbnail({image, deletable, thumbnails, list})
    }

    await Promise.all(thumbnails.map(thumbnail => thumbnail.load()))
    container.classList.remove(LOADING_CLASS)
  }

  async addCustomImageThumbnail (image) {
    const thumbnail = this.addThumbnail({
      image,
      deletable: true,
      thumbnails: this.thumbnails.custom,
      list: this.customList
    })

    await thumbnail.load()
  }

  deleteCustomImageThumbnail (image) {
    const thumbnail = this.getThumbnailFromImage(image)
    thumbnail.element.remove()
    this.thumbnails.custom.splice(this.thumbnails.custom.indexOf(thumbnail), 1)
  }

  async addCustomImagesFromFileList (files) {
    files = Array.from(files)
    let unsupportedFileTypes = false
    let extremeFileSizes = false

    await Promise.all(files.map(async file => {
      if (!SUPPORTED_FILE_TYPES.includes(file.type)) {
        unsupportedFileTypes = true
      } else if (file.size > MAXIMUM_FILE_SIZE) {
        extremeFileSizes = true
      } else {
        await this.manager.addCustomImage(file.path)
      }
    }))

    if (unsupportedFileTypes) {
      atom.notifications.addError(
        'Unsupported file type(s)',
        {
          dismissable: true,
          description: 'Images must be JPG or PNG files.'
        }
      )
    }

    if (extremeFileSizes) {
      atom.notifications.addError(
        'Extreme file size(s)',
        {
          dismissable: true,
          description: 'Images must be smaller than 10MB.'
        }
      )
    }
  }

  bindManagerListeners () {
    const listeners = {
      select: image => this.getThumbnailFromImage(image).select(),
      deselect: image => this.getThumbnailFromImage(image).deselect(),
      addCustomImage: image => this.addCustomImageThumbnail(image),
      deleteCustomImage: image => this.deleteCustomImageThumbnail(image)
    }

    for (const [event, listener] of Object.entries(listeners)) {
      this.manager.emitter.on(event, listener)

      this.disposables.add(new Disposable(() => {
        this.manager.emitter.off(event, listener)
      }))
    }
  }

  bindDragListeners () {
    this.customContainer.addEventListener('dragenter', event => {
      event.stopPropagation()
      this.dropZone.classList.add(DROP_ZONE_ACTIVE_CLASS)
    })

    this.dropZone.addEventListener('dragleave', event => {
      event.stopPropagation()
      this.dropZone.classList.remove(DROP_ZONE_ACTIVE_CLASS)
    })

    this.dropZone.addEventListener('drop', event => {
      event.stopPropagation()
      this.dropZone.classList.remove(DROP_ZONE_ACTIVE_CLASS)
      this.addCustomImagesFromFileList(event.dataTransfer.files)
    })
  }

  async load () {
    await Promise.all([
      this.loadList({
        directoryName: 'default',
        list: this.defaultList,
        container: this.defaultList
      }),
      this.loadList({
        directoryName: 'custom',
        list: this.customList,
        container: this.customContainer,
        deletable: true
      })
    ])

    if (this.manager.selectedImage) {
      this.getThumbnailFromImage(this.manager.selectedImage).select()
    }

    this.bindManagerListeners()
    this.bindDragListeners()
  }
}
