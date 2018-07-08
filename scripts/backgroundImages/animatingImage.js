'use strict'

const {createElement} = require('docrel')

const util = require('../util')

const MAIN_CLASS_NAME = `${util.SHORT_PACKAGE_NAME}-animating-background-image`

const ANIMATION_CLASS_NAMES = {
  in: `${MAIN_CLASS_NAME}-animate-in`,
  out: `${MAIN_CLASS_NAME}-animate-out`
}

module.exports = class AnimatingBackgroundImage {
  constructor () {
    this.element = createElement('div', {class: MAIN_CLASS_NAME})
    this.animating = false
  }

  animate ({image, out}) {
    return new Promise(resolve => {
      const animationClassName = (
        out ? ANIMATION_CLASS_NAMES.out : ANIMATION_CLASS_NAMES.in
      )

      this.element.addEventListener(
        'animationend',
        () => {
          this.element.classList.remove(animationClassName)
          this.animating = false
          resolve()
        },
        {once: true}
      )

      this.element.style.backgroundImage = util.getCssUrl(image.uri)
      this.element.classList.add(animationClassName)
      this.animating = true
    })
  }
}
