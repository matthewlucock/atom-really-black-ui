'use strict'

const {CompositeDisposable} = require('atom')

const BackgroundImageManager = require('./manager')
const BackgroundImagesView = require('./view')
const util = require('../util')

let manager
const disposables = new CompositeDisposable()

const activate = () => {
  if (manager) deactivate()
  manager = new BackgroundImageManager()

  disposables.add(
    manager.activate(),
    atom.workspace.addOpener(uri => {
      if (uri === util.BACKGROUND_IMAGES_VIEW_URI) {
        return new BackgroundImagesView(manager)
      }
    }),
    atom.commands.add('atom-workspace', {
      [util.getPackageCommandName('background-images')]: () => {
        atom.workspace.open(util.BACKGROUND_IMAGES_VIEW_URI)
      }
    })
  )
}

const deactivate = () => {
  disposables.dispose()
  manager = null
}

module.exports = {activate, deactivate}
