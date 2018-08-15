'use strict'

const fs = require('fs')
const makeCustomizableVariables = require('../styles/customizableVariables')
const metadata = require('../package.json')

const {general, imageBackground, solidBackground} = metadata.configSchema

const lessVariable = ([name, value]) => `@pure-${name}:${value};`

const data = {
  image: general.properties.background.default === 'Image',
  fontFamily: general.properties.fontFamily.default,
  baseFontSize: general.properties.baseFontSize.default,
  statusBarFontSize: general.properties.statusBarFontSize.default,
  scrollbarWidth: general.properties.scrollbarWidth.default
}

if (data.image) {
  Object.assign(data, {
    workspaceAlpha: imageBackground.properties.workspaceAlpha.default,
    accent: imageBackground.properties.accent.default,
    accentAlpha: imageBackground.properties.accentAlpha.default
  })
} else {
  Object.assign(data, {
    workspaceColor: solidBackground.properties.workspaceColor.default,
    accent: solidBackground.properties.accent.default
  })
}

const variables = makeCustomizableVariables(data)
const variablesText = Object.entries(variables).map(lessVariable).join('')
fs.writeFileSync('styles/customizable-variables.less', variablesText)
