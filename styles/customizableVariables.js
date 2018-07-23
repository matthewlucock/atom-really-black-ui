'use strict'

const Color = require('color')
const mem = require('mem')

const BLACK = new Color('black')
const WHITE = new Color('white')
const AVERAGE_OF_BLACK_AND_WHITE = BLACK.mix(WHITE, 0.5)

const ACTIVE_ACCENT_ALPHA_MODIFIER = 0.15
const ACTIVE_ACCENT_ALPHA_THRESHOLD = 0.5
const ACTIVE_ACCENT_LIGHTNESS_MODIFIER = ACTIVE_ACCENT_ALPHA_MODIFIER * 100
const ACTIVE_ACCENT_LIGHTNESS_THRESHOLD = ACTIVE_ACCENT_ALPHA_THRESHOLD * 100
const SUBTLE_TEXT_LIGHTNESS_MODIFIER = 30

const lighten = (color, amount) => color.lightness(color.lightness() + amount)
const darken = (color, amount) => lighten(color, -amount)

const contrastingTextColor = background => background.isDark() ? WHITE : BLACK

const modifyValue = ({value, modifier, threshold}) => {
  if (value + modifier < threshold) return value + modifier
  return value - modifier
}

const subtleTextColor = textColor => {
  if (textColor.isLight()) {
    return darken(textColor, SUBTLE_TEXT_LIGHTNESS_MODIFIER)
  }

  return lighten(textColor, SUBTLE_TEXT_LIGHTNESS_MODIFIER)
}

const imageVariables = mem(({workspaceAlpha, baseAccent, accentAlpha}) => {
  baseAccent = new Color(baseAccent)

  const workspaceColor = BLACK.alpha(workspaceAlpha)
  const opaqueWorkspaceColor = AVERAGE_OF_BLACK_AND_WHITE.mix(
    BLACK,
    workspaceAlpha
  )
  const workspaceTextColor = contrastingTextColor(opaqueWorkspaceColor)
  const subtleWorkspaceTextColor = subtleTextColor(workspaceTextColor)

  const accent = baseAccent.alpha(accentAlpha)
  const opaqueAccent = opaqueWorkspaceColor.mix(baseAccent, accentAlpha)
  const accentTextColor = contrastingTextColor(opaqueAccent)
  const subtleAccentTextColor = subtleTextColor(accentTextColor)

  const activeAccentAlpha = modifyValue({
    value: accent.alpha(),
    modifier: ACTIVE_ACCENT_ALPHA_MODIFIER,
    threshold: ACTIVE_ACCENT_ALPHA_THRESHOLD
  })
  const activeAccent = baseAccent.alpha(activeAccentAlpha)
  const opaqueActiveAccent = opaqueWorkspaceColor.mix(
    baseAccent,
    activeAccentAlpha
  )
  const activeAccentTextColor = contrastingTextColor(opaqueActiveAccent)

  return {
    'app-color': BLACK,
    'workspace-color': workspaceColor,
    'workspace-text-color': workspaceTextColor,
    'subtle-workspace-text-color': subtleWorkspaceTextColor,
    'accent': accent,
    'opaque-accent': opaqueAccent,
    'accent-text-color': accentTextColor,
    'subtle-accent-text-color': subtleAccentTextColor,
    'active-accent': activeAccent,
    'active-accent-text-color': activeAccentTextColor
  }
})

const solidVariables = mem(({workspaceColor, accent}) => {
  workspaceColor = new Color(workspaceColor)
  accent = new Color(accent)

  const workspaceTextColor = contrastingTextColor(workspaceColor)
  const subtleWorkspaceTextColor = subtleTextColor(workspaceTextColor)
  const accentTextColor = contrastingTextColor(accent)
  const subtleAccentTextColor = subtleTextColor(accentTextColor)

  const activeAccentLightness = modifyValue({
    value: accent.lightness(),
    modifier: ACTIVE_ACCENT_LIGHTNESS_MODIFIER,
    threshold: ACTIVE_ACCENT_LIGHTNESS_THRESHOLD
  })
  const activeAccent = accent.lightness(activeAccentLightness)
  const activeAccentTextColor = contrastingTextColor(activeAccent)

  return {
    'app-color': workspaceColor,
    'workspace-color': workspaceColor,
    'workspace-text-color': workspaceTextColor,
    'subtle-workspace-text-color': subtleWorkspaceTextColor,
    'accent': accent,
    'opaque-accent': accent,
    'accent-text-color': accentTextColor,
    'subtle-accent-text-color': subtleAccentTextColor,
    'active-accent': activeAccent,
    'active-accent-text-color': activeAccentTextColor
  }
})

module.exports = data => {
  const variables = {
    'base-font-size': data.baseFontSize,
    'status-bar-font-size': data.statusBarFontSize,
    'font-family': data.fontFamily,
    'scrollbar-width': data.scrollbarWidth
  }

  if (data.image) {
    Object.assign(variables, imageVariables({
      workspaceAlpha: data.workspaceAlpha,
      baseAccent: data.accent,
      accentAlpha: data.accentAlpha
    }))
  } else {
    Object.assign(variables, solidVariables({
      workspaceColor: data.workspaceColor,
      accent: data.accent
    }))
  }

  return variables
}
