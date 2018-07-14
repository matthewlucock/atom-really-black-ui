'use strict'

const {createElement} = require('docrel')

const utilities = require('../utilities')

const MAIN_CLASS_NAME = `pure-animating-background-image`

const ANIMATION_CLASS_NAMES = {
  in: `${MAIN_CLASS_NAME}-animate-in`,
  out: `${MAIN_CLASS_NAME}-animate-out`
}

module.exports = class AnimatingBackgroundImage {
  constructor () {
    this.element = createElement('div', {class: MAIN_CLASS_NAME})
    this.animating = false
  }

  async animate ({image, out}) {
    const animationClassName = (
      out ? ANIMATION_CLASS_NAMES.out : ANIMATION_CLASS_NAMES.in
    )

    await image.load()

    await new Promise(resolve => {
      this.element.addEventListener(
        'animationend',
        () => {
          this.element.classList.remove(animationClassName)
          this.animating = false
          resolve()
        },
        {once: true}
      )

      this.element.style.backgroundImage = utilities.getCssUrl(image.uri)
      this.element.classList.add(animationClassName)
      this.animating = true
    })
  }
}
