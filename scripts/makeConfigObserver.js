"use strict";
const util = require("./util");
const styleInjection = require("./styleInjection");

const timeouts = new Map;
const timeoutDuration = 500;

const makeCallbackWrapper = function(callback) {
    return function(value) {
        callback(value);

        if (util.themeHasActivated) {
            styleInjection.injectStyles();
            styleInjection.updateStyleVariablesFile();
        }
    };
};

module.exports = function(options) {
    const callbackWrapper = makeCallbackWrapper(options.callback);
    const observerID = Math.random();

    return function(value) {
        const boundCallbackWrapper = callbackWrapper.bind(undefined, value);

        if (options.hasTimeout && util.themeHasActivated) {
            if (timeouts.has(observerID)) {
                clearTimeout(timeouts.get(observerID));
            }

            const timeoutID = setTimeout(boundCallbackWrapper, timeoutDuration);
            timeouts.set(observerID, timeoutID);
        } else {
            boundCallbackWrapper();
        }
    };
};
