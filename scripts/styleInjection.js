const readFile = require("fs-readfile-promise");

const FILE_PATH = "injected-styles.css";
const styleVariables = new Map;

const stylesElement = document.createElement("style");
stylesElement.id = "really-black-ui-injected-styles";

let fileReadPromise;

const generateVariableRegExp = function(name) {
    return RegExp("\"@" + name + "\"", "g");
}

const init = function() {
    fileReadPromise = readFile(FILE_PATH, "utf8");
    document.head.appendChild(stylesElement);
};

const injectStyles = function() {
    fileReadPromise.then(function(css) {
        for (const [name, value] of styleVariables) {
            css = css.replace(generateVariableRegExp(name), value);
        }

        stylesElement.textContent = css;
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
