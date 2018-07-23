'use strict'

const fse = require('fs-extra')

const makeCustomizableVariables = require('../styles/customizableVariables')
const metadata = require('../package.json')

const FILE_PATH = 'styles/customizable-variables.less'

const lessVariable = ([name, value]) => `@pure-${name}:${value};`

const {general, imageBackgrounds, solidColorBackgrounds} = metadata.configSchema

const data = {
  baseFontSize: general.properties.mainFontSize.default,
  statusBarFontSize: general.properties.statusBarFontSize.default,
  fontFamily: general.properties.fontFamily.default,
  scrollbarWidth: general.properties.scrollbarWidth.default,
  image: general.properties.backgroundMode.default === 'Image'
}

if (data.image) {
  Object.assign(data, {
    workspaceAlpha: imageBackgrounds.properties.overlayAlphaChannel.default,
    accent: imageBackgrounds.properties.accentColor.default,
    accentAlpha: imageBackgrounds.properties.accentAlphaChannel.default
  })
} else {
  Object.assign(data, {
    workspaceColor: solidColorBackgrounds.properties.backgroundColor.default,
    accent: solidColorBackgrounds.properties.accentColor.default
  })
}

const variables = makeCustomizableVariables(data)
const variablesText = Object.entries(variables).map(lessVariable).join('')
fse.writeFileSync(FILE_PATH, variablesText)
