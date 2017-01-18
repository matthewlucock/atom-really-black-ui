const readFile = require("fs-readfile-promise");
const writeFile = require("fs-writefile-promise");

const PATHS = {
    customisableStyles: "styles/customisable/compiled.css",
    customisableVariables: "styles/user-defined-variables.less"
};

const styleVariables = new Map;
let customisableStylesReadPromise;
let customisableVariablesWritePromise;

const styleElement = document.createElement("style");
styleElement.id = "really-black-ui-customsiable-styles"

const generateVariableSyntax = function(name, value) {
    return "@" + name + ": " + value + ";\n";
};

const insertStyleVariablesIntoCSS = function(css) {
    for (const [name, value] of styleVariables) {
        const nameRegExp = RegExp("\"" + name + "\"", "g");
        css = css.replace(nameRegExp, value);
    }

    return css;
};

const makeWriteVariablesFunction = function(variablesText) {
    return function() {
        return writeFile(PATHS.customisableVariables, variablesText);
    };
};

const init = function() {
    customisableStylesReadPromise = readFile(PATHS.customisableStyles, "utf8");
    document.head.appendChild(styleElement);
};

const injectStyles = function() {
    return customisableStylesReadPromise.then(function(css) {
        css = insertStyleVariablesIntoCSS(css);
        styleElement.textContent = css;
    });
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
    styleElement,
    updateVariablesFile
};
