const readFile = require("fs-readfile-promise");
const Color = require("color");

const styleInjection = require("./styleInjection");
const makeConfigObserver = require("./makeConfigObserver");
const paneItemsObserver = require("./paneItemsObserver");
const themeHasActivated = require("./themeHasActivated");
const util = require("./util");

const CONFIG_KEY_PREFIX = "really-black-ui.";

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

const configObservers = [
    {
        configKey: CONFIG_KEY_PREFIX + "secondaryBackgroundColor",
        setter: setSecondaryBackgroundColor
    },
    {
        configKey: CONFIG_KEY_PREFIX + "mainFontSize",
        setter: setMainFontSize,
        timeout: true
    },
    {
        configKey: CONFIG_KEY_PREFIX + "statusBarFontSize",
        setter: setStatusBarFontSize,
        timeout: true
    }
];

const activate = function() {
    styleInjection.init();

    for (const observer of configObservers) {
        atom.config.observe(observer.configKey, makeConfigObserver(observer));
    }

    atom.workspace.observePaneItems(paneItemsObserver);
    themeHasActivated.value = true;
};

const deactivate = function() {
    styleInjection.removeStyles();
};

module.exports = {
    activate,
    deactivate
};
