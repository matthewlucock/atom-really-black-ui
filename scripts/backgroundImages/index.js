'use strict'

const {Disposable, CompositeDisposable} = require('atom')
const BackgroundImageManager = require('./manager')
const BackgroundImagesView = require('./view')
const {BACKGROUND_IMAGES_VIEW_URI, registerCommand} = require('../utilities')
const config = require('../config')
const customizableVariables = require('../customizableVariables')
const opener = require('../opener')

let manager
let disposables

const activate = () => {
  if (manager) deactivate()
  manager = new BackgroundImageManager()

  disposables = new CompositeDisposable(
    manager.activate(),
    opener.add(BACKGROUND_IMAGES_VIEW_URI, () => {
      return new BackgroundImagesView(manager)
    }),
    registerCommand('background-images', () => {
      atom.workspace.open(BACKGROUND_IMAGES_VIEW_URI)
    })
  )
}

const deactivate = () => {
  disposables.dispose()
  manager = null
}

const bindConfigListener = () => {
  const callback = backgroundMode => {
    if (backgroundMode === 'Image') {
      activate()
    } else {
      deactivate()
    }

    customizableVariables.set()
  }

  return new CompositeDisposable(
    config.observe('general.background', {callback}),
    new Disposable(deactivate)
  )
}

module.exports = {bindConfigListener}
