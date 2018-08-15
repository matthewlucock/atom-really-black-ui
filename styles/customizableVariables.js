'use strict'

const Color = require('color')
const mem = require('mem')

const BLACK = new Color('black')
const WHITE = new Color('white')
const AVERAGE_OF_BLACK_AND_WHITE = BLACK.mix(WHITE, 0.5)

const SOLID_ACCENT_LIGHTNESS_MODIFIER = 20
const ACTIVE_ACCENT_ALPHA_MODIFIER = 0.2
const ACTIVE_ACCENT_LIGHTNESS_MODIFIER = ACTIVE_ACCENT_ALPHA_MODIFIER * 100
const SUBTLE_TEXT_LIGHTNESS_MODIFIER = 30

const contrastingTextColor = background => background.isDark() ? WHITE : BLACK

const subtleTextColor = textColor => {
  const lightness = textColor.isDark()
    ? textColor.lightness() + SUBTLE_TEXT_LIGHTNESS_MODIFIER
    : textColor.lightness() - SUBTLE_TEXT_LIGHTNESS_MODIFIER

  return textColor.lightness(lightness)
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

  const activeAccentAlpha = (
    accent.alpha() + ACTIVE_ACCENT_ALPHA_MODIFIER < 0.5
      ? accent.alpha() + ACTIVE_ACCENT_ALPHA_MODIFIER
      : accent.alpha() - ACTIVE_ACCENT_ALPHA_MODIFIER
  )
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
    'opaque-active-accent': opaqueActiveAccent,
    'active-accent-text-color': activeAccentTextColor
  }
})

const solidVariables = mem(({workspaceColor, accent}) => {
  workspaceColor = new Color(workspaceColor)

  if (accent) {
    accent = new Color(accent)
  } else {
    const accentLightness = (
      workspaceColor.lightness() + SOLID_ACCENT_LIGHTNESS_MODIFIER < 60
        ? workspaceColor.lightness() + SOLID_ACCENT_LIGHTNESS_MODIFIER
        : workspaceColor.lightness() - SOLID_ACCENT_LIGHTNESS_MODIFIER
    )

    accent = workspaceColor.lightness(accentLightness)
  }

  const workspaceTextColor = contrastingTextColor(workspaceColor)
  const subtleWorkspaceTextColor = subtleTextColor(workspaceTextColor)
  const accentTextColor = contrastingTextColor(accent)
  const subtleAccentTextColor = subtleTextColor(accentTextColor)

  const activeAccentLightness = accent.lightness() > workspaceColor.lightness()
    ? accent.lightness() + ACTIVE_ACCENT_LIGHTNESS_MODIFIER
    : accent.lightness() - ACTIVE_ACCENT_LIGHTNESS_MODIFIER
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
    'opaque-active-accent': activeAccent,
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
