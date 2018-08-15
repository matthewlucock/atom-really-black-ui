'use strict'

const {Disposable, CompositeDisposable} = require('atom')
const BackgroundImageManager = require('./manager')
const BackgroundImagesView = require('./view')
const {BACKGROUND_IMAGES_VIEW_URI, registerCommand} = require('../utilities')
const config = require('../config')
const customizableVariables = require('../customizableVariables')

const COMMAND_NAME = 'background-images'

let manager
let disposables

const activate = () => {
  if (manager) deactivate()
  manager = new BackgroundImageManager()

  disposables = new CompositeDisposable(
    manager.activate(),
    atom.workspace.addOpener(uri => {
      if (uri === BACKGROUND_IMAGES_VIEW_URI) {
        return new BackgroundImagesView(manager)
      }
    }),
    registerCommand(COMMAND_NAME, () => {
      atom.workspace.open(BACKGROUND_IMAGES_VIEW_URI)
    }),
    atom.menu.add([{
      label: 'Packages',
      submenu: [{
        label: 'Pure',
        submenu: [{label: 'Background images', command: `pure:${COMMAND_NAME}`}]
      }]
    }]),
    new Disposable(() => {
      const pane = atom.workspace.paneForURI(BACKGROUND_IMAGES_VIEW_URI)
      if (!pane) return

      for (const item of pane.getItems()) {
        if (item instanceof BackgroundImagesView) pane.destroyItem(item)
      }
    })
  )
}

const deactivate = () => {
  if (disposables) disposables.dispose()
  manager = null
}

const bindConfigListeners = () => {
  return new CompositeDisposable(
    config.observe('general.background', {
      callback: background => background === 'Image' ? activate() : deactivate()
    }),
    config.onDidChange('general.background', {
      callback: customizableVariables.set
    }),
    new Disposable(deactivate)
  )
}

module.exports = {bindConfigListeners}
