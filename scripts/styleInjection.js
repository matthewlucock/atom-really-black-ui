"use strict";

const readFile = require("fs-readfile-promise");
const writeFile = require("fs-writefile-promise");

const util = require("./util");

const PATHS = {
    customisableStyles: "styles/customisable/compiled.css",
    styleVariables: "styles/user-defined-variables.less"
};

const styleVariables = new Map;
let customisableStylesReadPromise;
let styleVariablesWritePromise;

const styleElement = document.createElement("style");
styleElement.id = "really-black-ui-customsiable-styles";

const insertStyleVariablesIntoCSS = css => {
    for (const [name, value] of styleVariables) {
        const nameRegExp = RegExp(`"${name}"`, "g");
        css = css.replace(nameRegExp, value);
    }

    return css;
};

const generateStyleVariablesText = () => {
    let variablesText = "";

    for (const [name, value] of styleVariables) {
        variablesText += util.generateLessVariableSyntax(name, value);
    }

    return variablesText;
};

const writeStyleVariables = () => {
    return new Promise(() => {
        const variablesText = generateStyleVariablesText();
        return writeFile(PATHS.styleVariables, variablesText);
    });
};

const init = () => {
    customisableStylesReadPromise = readFile(PATHS.customisableStyles, "utf8");
    document.head.appendChild(styleElement);
};

const injectStyles = () => {
    return customisableStylesReadPromise.then(css => {
        css = insertStyleVariablesIntoCSS(css);
        styleElement.textContent = css;
    });
};

const updateStyleVariablesFile = () => {
    styleVariablesWritePromise = Promise.resolve(styleVariablesWritePromise)
        .then(writeStyleVariables, writeStyleVariables);
};

module.exports = {
    styleVariables,
    init,
    injectStyles,
    styleElement,
    updateStyleVariablesFile
};
