const readFile = require("fs-readfile-promise");

const configKeys = require("./configKeys");
const styleInjection = require("./styleInjection");
const makeConfigObserver = require("./makeConfigObserver");
const paneItemsObserver = require("./paneItemsObserver");
const themeHasActivated = require("./themeHasActivated");

const setMainFontSize = function(fontSize) {
    styleInjection.styleVariables["main-font-size"] = fontSize + "px";
};

const setStatusBarFontSize = function(fontSize) {
    styleInjection.styleVariables["status-bar-font-size"] = fontSize;
};

const mainFontSizeObserver = makeConfigObserver(
    "mainFontSize",
    setMainFontSize
);

const statusBarFontSizeObserver = makeConfigObserver(
    "statusBarFontSize",
    setStatusBarFontSize
);

const activate = function() {
    styleInjection.init();

    setMainFontSize(atom.config.get(configKeys.mainFontSize));
    setStatusBarFontSize(atom.config.get(configKeys.statusBarFontSize));
    styleInjection.injectStyles();

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
