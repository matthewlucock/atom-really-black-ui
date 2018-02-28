'use strict'

const {EventEmitter} = require('events')

const CLASS_NAMES = {
  main: 'pure-temporary-background',
  animating: 'pure-temporary-background-animating'
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
    this.element.style.backgroundImage = image.cssString
    this.element.classList.add(CLASS_NAMES.animating)
  }

  _animationCallback () {
    this.element.classList.remove(CLASS_NAMES.animating)
    this.emit('animated', this._image)
  }
}

module.exports = TemporaryBackground
