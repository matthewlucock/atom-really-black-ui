'use strict'

const {CompositeDisposable} = require('atom')

const BackgroundImageManager = require('./manager')
const {BackgroundImagesView, VIEW_URI} = require('./view')
const util = require('../util')

const manager = new BackgroundImageManager()

const activate = () => {
  manager.activate()

  const opener = atom.workspace.addOpener(uri => {
    if (uri === VIEW_URI) return new BackgroundImagesView(manager)
  })

  const commands = atom.commands.add('atom-workspace', {
    [util.getPackageCommandName('background-images')]: () => {
      atom.workspace.open(VIEW_URI)
    }
  })

  return new CompositeDisposable(opener, commands)
}

module.exports = {activate}
