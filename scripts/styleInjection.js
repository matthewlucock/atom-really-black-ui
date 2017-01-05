const readFile = require("fs-readfile-promise");

const FILE_PATH = "styles/injected-styles.css";
const styleVariables = {};
const STYLE_VARIABLE_PREFIX = "@";

const stylesElement = document.createElement("style");
stylesElement.id = "really-black-ui-injected-styles";

let fileRead;

const init = function() {
    fileRead = readFile(FILE_PATH, "utf8");
    document.head.appendChild(stylesElement);
};

const injectStyles = function() {
    fileRead.then(function(cssToInject) {
        for (const variableName of Object.keys(styleVariables)) {
            cssToInject = cssToInject.replace(
                STYLE_VARIABLE_PREFIX + variableName,
                styleVariables[variableName]
            );
        }

        stylesElement.textContent = cssToInject;
    });
};

const removeStyles = function() {
    document.head.removeChild(stylesElement);
};

module.exports = {
    init,
    injectStyles,
    removeStyles,
    styleVariables
};
