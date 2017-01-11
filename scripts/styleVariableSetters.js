const Color = require("color");

const util = require("./util");
const styleInjection = require("./styleInjection");

const setSecondaryBackgroundColor = function(passedColor) {
    passedColor = Color(passedColor.toHexString());

    const lighterSecondaryBackgroundColor = passedColor.lighten(0.1);
    const darkerSecondaryBackgroundColor = passedColor.darken(0.1);

    styleInjection.styleVariables
        .set("secondary-background-color", passedColor.rgb())
        .set(
            "lighter-secondary-background-color",
            lighterSecondaryBackgroundColor.rgb()
        )
        .set(
            "darker-secondary-background-color",
            darkerSecondaryBackgroundColor.rgb()
        )
        .set(
            "secondary-text-color",
            util.getMainTextColorFromBackground(passedColor)
        )
        .set(
            "lighter-secondary-text-color",
            util.getMainTextColorFromBackground(lighterSecondaryBackgroundColor)
        )
        .set(
            "darker-secondary-text-color",
            util.getMainTextColorFromBackground(darkerSecondaryBackgroundColor)
        );

    for (const colorName of util.GIT_TEXT_COLORS.keys()) {
        styleInjection.styleVariables.set(
            "git-text-color-" + colorName + "-selected",
            util.getGitTextColorsFromBackground[colorName](passedColor)
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
    setSecondaryBackgroundColor,
    setMainFontSize,
    setStatusBarFontSize
};
