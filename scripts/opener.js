'use strict'

const {Disposable} = require('atom')

const openers = {}

const add = (uri, callback) => {
  openers[uri] = callback
  return new Disposable(() => delete openers[uri])
}

const activate = () => {
  return atom.workspace.addOpener(uri => {
    const callback = openers[uri]
    if (callback) return callback()
  })
}

module.exports = {add, activate}
