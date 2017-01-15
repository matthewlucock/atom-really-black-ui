const Color = require("color");

const util = require("./util");
const styleInjection = require("./styleInjection");

const setSecondaryColor = function(secondaryColor) {
    secondaryColor = Color(secondaryColor.toHexString());

    const firstShade = secondaryColor.lighten(0.1);
    const secondShade = secondaryColor.darken(0.1);

    const textColor = util.getMainTextColorFromBackground(secondaryColor);
    const firstShadeTextColor = util.getMainTextColorFromBackground(firstShade);
    const secondShadeTextColor = util.getMainTextColorFromBackground(
        secondShade
    );

    styleInjection.styleVariables
        .set("secondary-color", secondaryColor.hex())
        .set("secondary-color-first-shade", firstShade.hex())
        .set("secondary-color-second-shade", secondShade.hex())
        .set("secondary-color-text-color", textColor.hex())
        .set(
            "secondary-color-first-shade-text-color",
            firstShadeTextColor.hex()
        )
        .set(
            "secondary-color-second-shade-text-color",
            secondShadeTextColor.hex()
        );

    for (const colorName of util.GIT_TEXT_COLORS.keys()) {
        styleInjection.styleVariables.set(
            "git-text-color-" + colorName + "-selected",
            util.getGitTextColorsFromBackground[colorName](secondaryColor)
        );
    }
};

const setMainFontSize = function(fontSize) {
    styleInjection.styleVariables.set("main-font-size", fontSize + "px");
};

const setStatusBarFontSize = function(fontSize) {
    styleInjection.styleVariables.set("status-bar-font-size", fontSize);
};

module.exports = {
    setSecondaryColor,
    setMainFontSize,
    setStatusBarFontSize
};
