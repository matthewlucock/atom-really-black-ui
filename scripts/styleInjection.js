const readFile = require("fs-readfile-promise");
const writeFile = require("fs-writefile-promise");

const INJECTED_STYLES_FILE_PATH = "injected-styles.css";
const CUSTOMISABLE_VARIBALES_FILE_PATH = "styles/user-defined-variables.less";
const CUSTOMISABLE_LESS_VARIABLES = [
    "main-font-size",
    "status-bar-font-size",
    "secondary-background-color"
];

const styleVariables = new Map;

const stylesElement = document.createElement("style");
stylesElement.id = "really-black-ui-injected-styles";

let injectedStylesReadPromise;
let customisableVariablesWritePromise;

const generateVariableRegExp = function(name) {
    return RegExp("\"@" + name + "\"", "g");
};

const generateVariableSyntax = function(name, value) {
    return "@" + name + ": " + value + ";\n";
};

const init = function() {
    injectedStylesReadPromise = readFile(INJECTED_STYLES_FILE_PATH, "utf8");
    document.head.appendChild(stylesElement);
};

const injectStyles = function() {
    injectedStylesReadPromise.then(function(css) {
        for (const [name, value] of styleVariables) {
            css = css.replace(generateVariableRegExp(name), value);
        }

        stylesElement.textContent = css;
    });
};

const removeStyles = function() {
    document.head.removeChild(stylesElement);
};

const updateVariablesFile = function() {
    let variablesText = "";

    for (const name of CUSTOMISABLE_LESS_VARIABLES) {
        const value = styleVariables.get(name);
        variablesText += generateVariableSyntax(name, value);
    }

    const writeVariables = function() {
        return writeFile(CUSTOMISABLE_VARIBALES_FILE_PATH, variablesText);
    };
    
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
