const readFile = require("fs-readfile-promise");
const writeFile = require("fs-writefile-promise");

const CUSTOMISABLE_STYLES_FILE_PATH = "styles/customisable-styles.css";
const CUSTOMISABLE_VARIBALES_FILE_PATH = "styles/user-defined-variables.less";

const styleVariables = new Map;

const stylesElement = document.createElement("style");
stylesElement.id = "really-black-ui-injected-styles";

let injectedStylesReadPromise;
let customisableVariablesWritePromise;

const generateVariableSyntax = function(name, value) {
    return "@" + name + ": " + value + ";\n";
};

const makeWriteVariablesFunction = function(variablesText) {
    return function() {
        return writeFile(CUSTOMISABLE_VARIBALES_FILE_PATH, variablesText);
    };
};

const init = function() {
    injectedStylesReadPromise = readFile(CUSTOMISABLE_STYLES_FILE_PATH, "utf8");
    document.head.appendChild(stylesElement);
};

const injectStyles = function() {
    injectedStylesReadPromise.then(function(css) {
        for (const [name, value] of styleVariables) {
            css = css.replace(RegExp("\"" + name + "\"", "g"), value);
        }

        stylesElement.textContent = css;
    });
};

const removeStyles = function() {
    document.head.removeChild(stylesElement);
};

const updateVariablesFile = function() {
    let variablesText = "";

    for (const [name, value] of styleVariables) {
        variablesText += generateVariableSyntax(name, value);
    }

    const writeVariables = makeWriteVariablesFunction(variablesText);

    customisableVariablesWritePromise = (
        Promise.resolve(customisableVariablesWritePromise)
            .then(writeVariables, writeVariables)
    );
};

module.exports = {
    styleVariables,
    init,
    injectStyles,
    removeStyles,
    updateVariablesFile
};
