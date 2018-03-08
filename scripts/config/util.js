'use strict'

const util = require('../util')

const makeKey = (keySuffix) => `${util.LONG_PACKAGE_NAME}.${keySuffix}`

const get = keySuffix => {
  const key = makeKey(keySuffix)
  const schema = atom.config.getSchema(key)

  let value = atom.config.get(key)
  if (schema.type === 'color') value = util.wrapAtomColor(value)

  return value
}

module.exports = {makeKey, get}
