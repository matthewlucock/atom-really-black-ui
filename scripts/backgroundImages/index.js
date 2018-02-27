'use strict'

const {CompositeDisposable} = require('atom')

const BackgroundImageManager = require('./manager')
const {BackgroundImagesView, VIEW_URI} = require('./view')

const disposables = new CompositeDisposable()

const manager = new BackgroundImageManager()

const activate = () => {
  manager.activate()

  const opener = atom.workspace.addOpener(uri => {
    if (uri === VIEW_URI) return new BackgroundImagesView(manager)
  })

  const commands = atom.commands.add('atom-workspace', {
    'pure:background-images': () => atom.workspace.open(VIEW_URI)
  })

  disposables.add(opener, commands)
}

const deactivate = () => {
  disposables.dispose()
}

module.exports = {activate, deactivate}
