'use strict'

const path = require('path')

const fse = require('fs-extra')
const less = require('less')

const DIRECTORY = 'styles/customizable'

const FILES = [
  'general',
  'editor',
  'image-background'
]

const DESTINATION_PATH = path.join(DIRECTORY, 'compiled.css')

const getLessFilePath = fileName => path.join(DIRECTORY, `${fileName}.less`)

const lessToRender = FILES
  .map(fileName => fse.readFileSync(getLessFilePath(fileName), 'utf8'))
  .join('')
  .replace(/@([^\s;)]+)/g, '"$1"')

;(async () => {
  const {css} = await less.render(lessToRender, {compress: true})
  await fse.writeFile(DESTINATION_PATH, css)
})()
