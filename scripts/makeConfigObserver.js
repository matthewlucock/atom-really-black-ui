const styleInjection = require("./styleInjection");
const themeHasActivated = require("./themeHasActivated");

const timeouts = {};
const observerTimeoutDuration = 500;

module.exports = function(timeoutName, valueSettingFunction) {
    const timeoutFunction = function(value) {
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

        timeouts[timeoutName] = setTimeout(
            timeoutFunction.bind(undefined, value),
            observerTimeoutDuration
        );
    };
};
