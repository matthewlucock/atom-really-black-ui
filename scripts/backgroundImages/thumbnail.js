'use strict'

const {EventEmitter} = require('events')

const {createElement} = require('docrel')

const util = require('../util')

const BASE_CLASS = `${util.BACKGROUND_IMAGES_VIEW_CLASS}-thumbnail`
const LOADING_CLASS = `${BASE_CLASS}-loading`
const SELECTED_CLASS = `${BASE_CLASS}-selected`
const IMAGE_CLASS = `${BASE_CLASS}-image`
const DELETE_BUTTON_CLASS = `${BASE_CLASS}-delete-button`

module.exports = class BackgroundImageThumbnail {
  constructor ({image, deletable}) {
    this.image = image
    this.emitter = new EventEmitter()

    this.imageElement = createElement('img', {class: IMAGE_CLASS})

    this.element = createElement(
      'div',
      {
        classList: [BASE_CLASS, LOADING_CLASS],
        events: {click: () => this.emitter.emit('select')}
      },
      [this.imageElement]
    )

    if (deletable) {
      this.element.append(createElement(
        'button',
        {
          classList: ['btn', DELETE_BUTTON_CLASS],
          events: {
            click: event => {
              event.stopPropagation()
              this.emitter.emit('delete')
            }
          }
        },
        [createElement('span', {classList: ['icon', 'icon-remove-close']})]
      ))
    }
  }

  async load () {
    await this.image.load()
    this.element.classList.remove(LOADING_CLASS)
    this.imageElement.src = this.image.uri
  }

  select () {
    this.element.classList.add(SELECTED_CLASS)
  }

  deselect () {
    this.element.classList.remove(SELECTED_CLASS)
  }
}
