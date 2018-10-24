'use strict'

const { EventEmitter } = require('events')
const { createElement } = require('docrel')
const { BACKGROUND_IMAGES_VIEW_CLASS } = require('../utilities')

const BASE_CLASS = `${BACKGROUND_IMAGES_VIEW_CLASS}-thumbnail`
const LOADING_CLASS = `${BASE_CLASS}-loading`
const SELECTED_CLASS = `${BASE_CLASS}-selected`

// A thumbnail for a background image for use in the background images view.
module.exports = class BackgroundImageThumbnail {
  /**
   * @param {object} options
   * @param {BackgroundImage} options.image
   * @param {boolean} options.deletable
   */
  constructor ({ image, deletable }) {
    this.image = image
    this.emitter = new EventEmitter()

    this.imageElement = createElement('img', { class: `${BASE_CLASS}-image` })

    this.element = createElement(
      'div',
      {
        classList: [BASE_CLASS, LOADING_CLASS],
        events: {
          /**
           * @emits BackgroundImageThumbnail#select
           */
          click: () => this.emitter.emit('select')
        }
      },
      [this.imageElement]
    )

    if (deletable) {
      this.element.append(createElement(
        'button',
        {
          classList: ['btn', `${BASE_CLASS}-delete-button`],
          events: {
            /**
             * @emits BackgroundImagesThumbbail#delete
             */
            click: event => {
              event.stopPropagation()
              this.emitter.emit('delete')
            }
          }
        },
        [createElement('span', { classList: ['icon', 'icon-remove-close'] })]
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
