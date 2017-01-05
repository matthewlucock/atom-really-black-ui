const styleInjection = require("./styleInjection");
const themeHasActivated = require("./themeHasActivated");

const timeouts = {};
const observerTimeoutDuration = 500;

module.exports = function(valueSettingFunction, timeoutName) {
    const valueHandler = function(value) {
        valueSettingFunction(value);
        styleInjection.injectStyles();
    };

    return function(value) {
        if (!themeHasActivated.value) {
            return;
        }

        if (timeouts[timeoutName]) {
            clearTimeout(timeouts[timeoutName]);
            delete timeouts[timeoutName];
        }

        if (timeoutName) {
            timeouts[timeoutName] = setTimeout(
                valueHandler.bind(undefined, value),
                observerTimeoutDuration
            );
        } else {
            valueHandler(value);
        }
    };
};
