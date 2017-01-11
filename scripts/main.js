const util = require("./util");
const styleInjection = require("./styleInjection");
const styleVariableSetters = require("./styleVariableSetters");
const makeConfigObserver = require("./makeConfigObserver");
const paneItemsObserver = require("./paneItemsObserver");

const CONFIG_KEY_PREFIX = "really-black-ui.";

const configObservers = [
    {
        configKey: CONFIG_KEY_PREFIX + "secondaryBackgroundColor",
        setter: styleVariableSetters.setSecondaryBackgroundColor
    },
    {
        configKey: CONFIG_KEY_PREFIX + "mainFontSize",
        setter: styleVariableSetters.setMainFontSize,
        timeout: true
    },
    {
        configKey: CONFIG_KEY_PREFIX + "statusBarFontSize",
        setter: styleVariableSetters.setStatusBarFontSize,
        timeout: true
    }
];

const activate = function() {
    styleInjection.init();

    for (const observer of configObservers) {
        atom.config.observe(observer.configKey, makeConfigObserver(observer));
    }

    atom.workspace.observePaneItems(paneItemsObserver);
    util.themeHasActivated = true;
};

const deactivate = function() {
    styleInjection.removeStyles();
};

module.exports = {
    activate,
    deactivate
};
