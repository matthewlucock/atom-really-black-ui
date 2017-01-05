const readFile = require("fs-readfile-promise");
const observePaneItemsCallback = require("./observePaneItemsCallback");

const styleVariables = {};
const styleVariablePrefix = "@";
const injectedStylesFilePath = "styles/injected-styles.css";
let injectedStylesFileRead;

let injectedStylesElement = document.createElement("style");
injectedStylesElement.id = "really-black-ui-injected-styles";

const observerTimeoutDuration = 500;
let mainFontSizeObserverTimeout;
let statusBarFontSizeObserverTimeout;

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

const setMainFontSize = function(fontSize) {
    styleVariables["main-font-size"] = fontSize + "px";
};

const setStatusBarFontSize = function(fontSize) {
    styleVariables["status-bar-font-size"] = fontSize;
};

const mainFontSizeObserver = function(fontSize) {
    if (!themeHasActivated) {
        return;
    }

    if (mainFontSizeObserverTimeout) {
        clearTimeout(mainFontSizeObserverTimeout);
    }

    mainFontSizeObserverTimeout = setTimeout(
        function() {
            setMainFontSize(fontSize);
            injectStyles();
        },
        observerTimeoutDuration
    );
};

const statusBarFontSizeObserver = function(fontSize) {
    if (!themeHasActivated) {
        return;
    }

    if (statusBarFontSizeObserverTimeout) {
        clearTimeout(statusBarFontSizeObserverTimeout);
    }

    statusBarFontSizeObserverTimeout = setTimeout(
        function() {
            setStatusBarFontSize(fontSize);
            injectStyles();
        },
        observerTimeoutDuration
    )
}

const activate = function() {
    injectedStylesFileRead = readFile(injectedStylesFilePath, "utf8");

    setMainFontSize(atom.config.get("really-black-ui.mainFontSize"));
    setStatusBarFontSize(
        atom.config.get("really-black-ui.statusBarFontSize")
    );
    injectStyles();
    document.head.appendChild(injectedStylesElement);
    atom.workspace.observePaneItems(observePaneItemsCallback);
    atom.config.observe("really-black-ui.mainFontSize", mainFontSizeObserver);
    atom.config.observe(
        "really-black-ui.statusBarFontSize",
        statusBarFontSizeObserver
    );
    themeHasActivated = true;
};

const deactivate = function() {
    clearTimeout(mainFontSizeObserverTimeout);
    document.head.removeChild(injectedStylesElement);
};

module.exports = {
    activate,
    deactivate
};
