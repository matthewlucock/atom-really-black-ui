const Color = require("color");

const util = require("./util");
const styleInjection = require("./styleInjection");

const DONT_STYLE_THE_EDITOR_CLASS = "really-black-ui-dont-style-the-editor";

const secondaryColor = function(secondaryColor) {
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

const mainFontSize = function(fontSize) {
    styleInjection.styleVariables.set("main-font-size", fontSize + "px");
};

const statusBarFontSize = function(fontSize) {
    styleInjection.styleVariables.set("status-bar-font-size", fontSize);
};

const styleTheEditor = function(value) {
    styleInjection.styleVariables.set("style-the-editor", value);

    if (value) {
        document.body.classList.remove(DONT_STYLE_THE_EDITOR_CLASS);
    } else {
        document.body.classList.add(DONT_STYLE_THE_EDITOR_CLASS);
    }
};

module.exports = {
    secondaryColor,
    mainFontSize,
    statusBarFontSize,
    styleTheEditor
};
