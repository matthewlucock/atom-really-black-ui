'use strict'

const {CompositeDisposable} = require('atom')

const BackgroundImageManager = require('./manager')
const BackgroundImagesView = require('./view')
const {BACKGROUND_IMAGES_VIEW_URI} = require('../data')
const opener = require('../opener')
const utilities = require('../utilities')

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
    utilities.registerCommand('background-images', () => {
      atom.workspace.open(BACKGROUND_IMAGES_VIEW_URI)
    })
  )
}

const deactivate = () => {
  disposables.dispose()
  manager = null
}

module.exports = {activate, deactivate}
