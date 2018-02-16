'use strict'

const fse = require('fs-extra')

const less = require('less')

const LESS_PATHS = [
  'styles/customisable/general.less',
  'styles/customisable/editor.less'
]
const DESTINATION_CSS_PATH = 'styles/customisable/compiled.css'

const lessToParse = LESS_PATHS
  .map(filePath => fse.readFileSync(filePath, 'utf8'))
  .join('')
  .replace(/@([^\s;)]+)/g, '"$1"')

;(async () => {
  const {css} = await less.render(lessToParse, {compress: true})
  await fse.writeFile(DESTINATION_CSS_PATH, css)
})()
