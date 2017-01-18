const util = require("./util");
const styleInjection = require("./styleInjection");
const makeConfigObserver = require("./makeConfigObserver");
const configObserverCallbacks = require("./configObserverCallbacks");

const CONFIG_KEY_PREFIX = "really-black-ui.";

const configObservers = [
    {
        configKey: CONFIG_KEY_PREFIX + "secondaryColor",
        callback: configObserverCallbacks.setSecondaryColor
    },
    {
        configKey: CONFIG_KEY_PREFIX + "mainFontSize",
        callback: configObserverCallbacks.setMainFontSize,
        timeout: true
    },
    {
        configKey: CONFIG_KEY_PREFIX + "statusBarFontSize",
        callback: configObserverCallbacks.setStatusBarFontSize,
        timeout: true
    },
    {
        configKey: CONFIG_KEY_PREFIX + "styleTheEditor",
        callback: configObserverCallbacks.setStyleTheEditor
    }
];

const activate = function() {
    styleInjection.init();

    for (const observer of configObservers) {
        atom.config.observe(observer.configKey, makeConfigObserver(observer));
    }

    util.themeHasActivated = true;
};

const deactivate = function() {
    styleInjection.styleElement.remove();
    util.themeHasActivated = false;
};

module.exports = {
    activate,
    deactivate
};
