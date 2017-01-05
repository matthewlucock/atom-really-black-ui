const readFile = require("fs-readfile-promise");
const observePaneItemsCallback = require("./observePaneItemsCallback");

const styleVariables = {};
const styleVariablePrefix = "@";
const injectedStylesFilePath = "styles/injected-styles.css";
let injectedStylesFileRead;

let injectedStylesElement = document.createElement("style");
injectedStylesElement.id = "really-black-ui-injected-styles";

let fontSizeObserverTimeout;

let themeHasActivated;

const injectStyles = function() {
    injectedStylesFileRead.then(function(cssToInject) {
        for (const variableName of Object.keys(styleVariables)) {
            cssToInject = cssToInject.replace(
                styleVariablePrefix + variableName,
                styleVariables[variableName]
            );
        }

        injectedStylesElement.textContent = cssToInject;
    });
};

const setFontSize = function(fontSize) {
    styleVariables["font-size"] = fontSize + "px";
};

const fontSizeObserver = function(fontSize) {
    if (!themeHasActivated) {
        return;
    }

    if (fontSizeObserverTimeout) {
        clearTimeout(fontSizeObserverTimeout);
    }

    fontSizeObserverTimeout = setTimeout(
        function() {
            setFontSize(fontSize);
            injectStyles();
        },
        500
    );
};

const activate = function() {
    injectedStylesFileRead = readFile(injectedStylesFilePath, "utf8");

    setFontSize(atom.config.get("really-black-ui.fontSize"));
    document.head.appendChild(injectedStylesElement);
    atom.workspace.observePaneItems(observePaneItemsCallback);
    atom.config.observe("really-black-ui.fontSize", fontSizeObserver);

    themeHasActivated = true;
};

const deactivate = function() {
    clearTimeout(fontSizeObserverTimeout);
    document.head.removeChild(injectedStylesElement);
};

module.exports = {
    activate,
    deactivate
};
