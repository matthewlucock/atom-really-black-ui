"use strict";
const readFile = require("fs-readfile-promise");
const writeFile = require("fs-writefile-promise");

const PATHS = {
    customisableStyles: "styles/customisable/compiled.css",
    styleVariables: "styles/user-defined-variables.less"
};

const styleVariables = new Map;
let customisableStylesReadPromise;
let styleVariablesWritePromise;

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

const generateStyleVariablesText = function() {
    let variablesText = "";

    for (const [name, value] of styleVariables) {
        variablesText += generateVariableSyntax(name, value);
    }

    return variablesText;
};

const writeStyleVariables = function() {
    return new Promise(function() {
        const variablesText = generateStyleVariablesText();
        return writeFile(PATHS.styleVariables, variablesText)
    });
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

const updateStyleVariablesFile = function() {
    styleVariablesWritePromise = Promise.resolve(styleVariablesWritePromise)
        .then(writeStyleVariables, writeStyleVariables)
};

module.exports = {
    styleVariables,
    init,
    injectStyles,
    styleElement,
    updateStyleVariablesFile
};
