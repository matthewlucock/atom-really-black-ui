const util = require("./util");
const styleInjection = require("./styleInjection");

const timeouts = new Map;
const timeoutDuration = 500;

module.exports = function(options) {
    const valueHandler = function(value) {
        options.setter(value);

        if (util.themeHasActivated) {
            styleInjection.injectStyles();
            styleInjection.updateVariablesFile();
        }
    };

    return function(value) {
        if (options.timeout && util.themeHasActivated) {
            if (timeouts.has(options.configKey)) {
                clearTimeout(timeouts.get(options.configKey));
                timeouts.delete(options.configKey);
            }

            const timeoutId = setTimeout(
                valueHandler.bind(undefined, value),
                timeoutDuration
            );

            timeouts.set(options.configKey, timeoutId);
        } else {
            valueHandler(value);
        }
    };
};
