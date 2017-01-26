"use strict";

const configObserverCallbacks = require("./configObserverCallbacks");
const makeConfigObserver = require("./makeConfigObserver");
const styleInjection = require("./styleInjection");
const util = require("./util");

const CONFIG_KEY_PREFIX = "really-black-ui.";

const CONFIG_KEYS = [
    "secondaryColor",
    "mainFontSize",
    "statusBarFontSize",
    "styleTheEditor"
];

const CONFIG_KEYS_WITH_OBSERVER_TIMEOUTS = [
    "mainFontSize",
    "statusBarFontSize"
];

const activate = () => {
    styleInjection.init();

    for (const keySuffix of CONFIG_KEYS) {
        const key = CONFIG_KEY_PREFIX + keySuffix;
        const callback = configObserverCallbacks[keySuffix];
        const hasTimeout = CONFIG_KEYS_WITH_OBSERVER_TIMEOUTS.includes(key);

        const observer = makeConfigObserver({callback, hasTimeout});
        atom.config.observe(key, observer);
    }

    util.themeHasActivated = true;
};

const deactivate = () => {
    styleInjection.styleElement.remove();
    util.themeHasActivated = false;
};

module.exports = {
    activate,
    deactivate
};
