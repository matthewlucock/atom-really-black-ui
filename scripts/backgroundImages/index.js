'use strict'

// This module is used to activate and deactivate background images, and
// and provides a method for binding corresponding config listeners.

const { Disposable, CompositeDisposable } = require('atom')
const BackgroundImageManager = require('./manager')
const BackgroundImagesView = require('./view')
const { BACKGROUND_IMAGES_VIEW_URI, registerCommand } = require('../utilities')
const config = require('../config')
const customizableVariables = require('../customizableVariables')

// The name of the command that opens the background images view.
const VIEW_COMMAND = 'background-images'

let manager
let disposables

const activate = () => {
  // Deactivate if already activated.
  if (manager) deactivate()

  manager = new BackgroundImageManager()

  disposables = new CompositeDisposable(
    manager.activate(),
    atom.workspace.addOpener(uri => {
      if (uri === BACKGROUND_IMAGES_VIEW_URI) {
        return new BackgroundImagesView(manager)
      }
    }),
    registerCommand(VIEW_COMMAND, () => {
      atom.workspace.open(BACKGROUND_IMAGES_VIEW_URI)
    }),
    atom.menu.add([{
      label: 'Packages',
      submenu: [{
        label: 'Pure',
        submenu: [{
          label: 'Background images',
          command: `pure:${VIEW_COMMAND}`
        }]
      }]
    }]),
    // Closed the background images view if it is open when background images
    // get deactivated.
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

module.exports = {
  /**
   * Bind the config listeners used to activate and deactivate background images
   * when the background setting is changed.
   * @returns {CompositeDisposable}
   */
  bindConfigListeners () {
    return new CompositeDisposable(
      config.observe('general.background', {
        callback (background) {
          if (background === 'Image') {
            activate()
          } else {
            deactivate()
          }
        }
      }),
      config.onDidChange('general.background', {
        callback: customizableVariables.set
      }),
      new Disposable(deactivate)
    )
  }
}
