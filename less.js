'use strict'

const fs = require('fs')

const less = require('less')

const LESS_PATHS = [
  'styles/customisable/general.less',
  'styles/customisable/editor.less'
]
const DESTINATION_CSS_PATH = 'styles/customisable/compiled.css'

const lessToParse = LESS_PATHS
  .map(filePath => fs.readFileSync(filePath, 'utf8'))
  .join('')
  .replace(/@([^\s;)]+)/g, '"$1"')

less.render(lessToParse, {compress: true})
  .then(output => {
    fs.writeFileSync(DESTINATION_CSS_PATH, output.css)
  })
