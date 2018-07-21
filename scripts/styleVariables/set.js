'use strict'

const config = require('../config')
const data = require('../data')
const styleVariables = require('.')
const utilities = require('../utilities')

const OPAQUE_COLOR_ALPHA_MODIFIER = 0.1
const ACTIVE_ACCENT_ALPHA_MODIFIER = 0.2
const ACTIVE_ACCENT_LIGHTNESS_MODIFIER = ACTIVE_ACCENT_ALPHA_MODIFIER * 100
const SUBTLE_TEXT_COLOR_LIGHTNESS_MODIFIER = 30

const getSubtleTextColor = textColor => {
  const modifierMultiplier = textColor.isDark() ? 1 : -1
  return utilities.modifyColorLightness(
    textColor,
    SUBTLE_TEXT_COLOR_LIGHTNESS_MODIFIER * modifierMultiplier
  )
}

const getImageActiveAccentStyles = accentColor => {
  const modifierMultiplier = (
    accentColor.alpha() + ACTIVE_ACCENT_ALPHA_MODIFIER < 0.9 ? 1 : -1
  )

  const opaqueAccentColor = utilities.BLACK.mix(
    accentColor,
    (
      ACTIVE_ACCENT_ALPHA_MODIFIER + OPAQUE_COLOR_ALPHA_MODIFIER
    ) * modifierMultiplier
  )

  return {
    'active-accent-color': utilities.modifyColorAlpha(
      accentColor,
      ACTIVE_ACCENT_ALPHA_MODIFIER * modifierMultiplier
    ),
    'active-accent-text-color': utilities.getContrastingTextColor(
      opaqueAccentColor
    )
  }
}

const getSolidActiveAccentStyles = accentColor => {
  const modifierMultiplier = (
    accentColor.lightness() + ACTIVE_ACCENT_LIGHTNESS_MODIFIER < 90 ? 1 : -1
  )
  const activeAccentColor = utilities.modifyColorLightness(
    accentColor,
    ACTIVE_ACCENT_LIGHTNESS_MODIFIER * modifierMultiplier
  )

  return {
    'active-accent-color': activeAccentColor,
    'active-accent-text-color': utilities.getContrastingTextColor(
      activeAccentColor
    )
  }
}

const getImageBackgroundVariables = () => {
  const workspaceAlphaChannel = config.get(
    'imageBackgrounds.overlayAlphaChannel'
  )
  const workspaceBackgroundColor = utilities.BLACK.alpha(workspaceAlphaChannel)
  const opaqueWorkspaceBackgroundColor = utilities.WHITE.mix(
    utilities.BLACK,
    workspaceAlphaChannel + OPAQUE_COLOR_ALPHA_MODIFIER
  )
  const workspaceTextColor = utilities.getContrastingTextColor(
    opaqueWorkspaceBackgroundColor
  )

  const accentColor = config.get('imageBackgrounds.accentColor')
  const accentAlphaChannel = config.get('imageBackgrounds.accentAlphaChannel')
  const translucentAccentColor = accentColor.alpha(accentAlphaChannel)
  const opaqueAccentColor = utilities.BLACK.mix(
    accentColor,
    accentAlphaChannel + OPAQUE_COLOR_ALPHA_MODIFIER
  )
  const accentTextColor = utilities.getContrastingTextColor(opaqueAccentColor)

  return Object.assign(
    {
      'app-background-color': utilities.BLACK,
      'workspace-background-color': workspaceBackgroundColor,
      'workspace-text-color': workspaceTextColor,
      'workspace-subtle-text-color': getSubtleTextColor(workspaceTextColor),
      'accent-color': translucentAccentColor,
      'opaque-accent-color': opaqueAccentColor,
      'accent-text-color': accentTextColor,
      'accent-subtle-text-color': getSubtleTextColor(accentTextColor)
    },
    getImageActiveAccentStyles(translucentAccentColor)
  )
}

const getSolidBackgroundVariables = () => {
  const workspaceBackgroundColor = config.get(
    'solidColorBackgrounds.backgroundColor'
  )
  const workspaceTextColor = utilities.getContrastingTextColor(
    workspaceBackgroundColor
  )

  const accentColor = config.get('solidColorBackgrounds.accentColor')
  const accentTextColor = utilities.getContrastingTextColor(accentColor)

  return Object.assign(
    {
      'app-background-color': workspaceBackgroundColor,
      'workspace-background-color': workspaceBackgroundColor,
      'workspace-text-color': workspaceTextColor,
      'workspace-subtle-text-color': getSubtleTextColor(workspaceTextColor),
      'accent-color': accentColor,
      'opaque-accent-color': accentColor,
      'accent-text-color': accentTextColor,
      'accent-subtle-text-color': getSubtleTextColor(accentTextColor)
    },
    getSolidActiveAccentStyles(accentColor)
  )
}

module.exports = async () => {
  if (!data.themeIsActive) return

  const backgroundVariables = config.get('general.backgroundMode') === 'Image'
    ? getImageBackgroundVariables()
    : getSolidBackgroundVariables()

  const values = Object.assign(
    {
      'base-font-size': config.get('general.mainFontSize'),
      'status-bar-font-size': config.get('general.statusBarFontSize'),
      'font-family': config.get('general.fontFamily'),
      'scrollbar-width': config.get('general.scrollbarWidth')
    },
    backgroundVariables
  )

  styleVariables.inject(values)
  await styleVariables.write(values)
}
