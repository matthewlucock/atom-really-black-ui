const readFile = require("fs-readfile-promise");
const Color = require("color");

const configKeys = require("./configKeys");
const styleInjection = require("./styleInjection");
const makeConfigObserver = require("./makeConfigObserver");
const paneItemsObserver = require("./paneItemsObserver");
const themeHasActivated = require("./themeHasActivated");

const setSecondaryBackgroundColor = function(passedColor) {
    passedColor = passedColor.toHexString();
    styleInjection.styleVariables["secondary-background-color"] = passedColor;

    passedColor = Color(passedColor);

    styleInjection.styleVariables["standard-button-hover-focus-color"] = (
        passedColor.lighten(0.05).hex()
    );
    styleInjection.styleVariables["standard-button-active-color"] = (
        passedColor.darken(0.05).hex()
    );
};

const setMainFontSize = function(fontSize) {
    styleInjection.styleVariables["main-font-size"] = fontSize + "px";
};

const setStatusBarFontSize = function(fontSize) {
    styleInjection.styleVariables["status-bar-font-size"] = fontSize;
};

const secondaryBackgroundColorObserver = makeConfigObserver(
    setSecondaryBackgroundColor
);

const mainFontSizeObserver = makeConfigObserver(
    setMainFontSize,
    "mainFontSize"
);

const statusBarFontSizeObserver = makeConfigObserver(
    setStatusBarFontSize,
    "statusBarFontSize"
);

const activate = function() {
    styleInjection.init();

    setSecondaryBackgroundColor(
        atom.config.get(configKeys.secondaryBackgroundColor)
    );
    setMainFontSize(atom.config.get(configKeys.mainFontSize));
    setStatusBarFontSize(atom.config.get(configKeys.statusBarFontSize));
    styleInjection.injectStyles();

    atom.config.observe(
        configKeys.secondaryBackgroundColor,
        secondaryBackgroundColorObserver
    );
    atom.config.observe(configKeys.mainFontSize, mainFontSizeObserver);
    atom.config.observe(
        configKeys.statusBarFontSize,
        statusBarFontSizeObserver
    );

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
