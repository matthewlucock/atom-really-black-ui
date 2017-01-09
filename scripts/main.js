const readFile = require("fs-readfile-promise");
const Color = require("color");

const styleInjection = require("./styleInjection");
const makeConfigObserver = require("./makeConfigObserver");
const paneItemsObserver = require("./paneItemsObserver");
const themeHasActivated = require("./themeHasActivated");

const CONFIG_KEY_PREFIX = "really-black-ui.";

const setSecondaryBackgroundColor = function(passedColor) {
    console.log(passedColor, atom.config.get("really-black-ui.secondaryBackgroundColor"));
    passedColor = Color(passedColor.toHexString());

    styleInjection.styleVariables
        .set("secondary-background-color", passedColor)
        .set(
            "standard-button-hover-focus-color",
            passedColor.lighten(0.05).string()
        )
        .set(
            "standard-button-active-color",
            passedColor.darken(0.05).string()
        );
};

const setMainFontSize = function(fontSize) {
    styleInjection.styleVariables.set("main-font-size", fontSize + "px");
};

const setStatusBarFontSize = function(fontSize) {
    styleInjection.styleVariables.set("status-bar-font-size", fontSize);
};

const configObservers = [
    {
        configKey: "secondaryBackgroundColor",
        setter: setSecondaryBackgroundColor
    },
    {
        configKey: "mainFontSize",
        setter: setMainFontSize,
        timeout: true
    },
    {
        configKey: "statusBarFontSize",
        setter: setStatusBarFontSize,
        timeout: true
    }
];

const activate = function() {
    styleInjection.init();

    for (const observer of configObservers) {
        observer.configKey = CONFIG_KEY_PREFIX + observer.configKey;
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
