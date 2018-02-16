'use strict'

const fse = require('fs-extra')
const path = require('path')

const less = require('less')

const CUSTOMISABLE_STYLES_DIRECTORY_PATH = 'styles/customisable'

const LESS_PATHS = [
  path.join(CUSTOMISABLE_STYLES_DIRECTORY_PATH, 'general.less'),
  path.join(CUSTOMISABLE_STYLES_DIRECTORY_PATH, 'editor.less')
]

const DESTINATION_CSS_PATH = path.join(
  CUSTOMISABLE_STYLES_DIRECTORY_PATH,
  'compiled.css'
)

const lessToParse = LESS_PATHS
  .map(filePath => fse.readFileSync(filePath, 'utf8'))
  .join('')
  .replace(/@([^\s;)]+)/g, '"$1"')

;(async () => {
  const {css} = await less.render(lessToParse, {compress: true})
  await fse.writeFile(DESTINATION_CSS_PATH, css)
})()
