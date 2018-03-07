'use strict'

const {EventEmitter} = require('events')

const util = require('../util')

const CLASS_NAMES = {
  main: `${util.SHORT_PACKAGE_NAME}-temporary-background`,
  animating: `${util.SHORT_PACKAGE_NAME}-temporary-background-animating`
}

class TemporaryBackground extends EventEmitter {
  constructor () {
    super()

    this.element = document.createElement('div')
    this.element.className = CLASS_NAMES.main

    this.element.addEventListener('transitionend', event => {
      if (event.propertyName === 'opacity') this._animationCallback()
    })
  }

  animate (image) {
    this._image = image
    this.element.style.backgroundImage = util.getCssUrl(image.uri)
    this.element.classList.add(CLASS_NAMES.animating)
  }

  _animationCallback () {
    this.element.classList.remove(CLASS_NAMES.animating)
    this.emit('animated', this._image)
  }
}

module.exports = TemporaryBackground
