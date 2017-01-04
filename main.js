const fs = require("fs");
const checkboxClass = "input-checkbox";
const toggleClass = "input-toggle";

const styleVariables = {};
const styleVariablePrefix = "@";
const injectedStylesFilePath = "styles/injected-styles.css";
let injectedStylesFileRead;

let injectedStylesElement = document.createElement("style");
injectedStylesElement.id = "really-black-ui-injected-styles";

let fontSizeObserverTimeout;

let themeHasActivated;

const observePaneItemsCallback = function(paneItem) {
    const checkboxes = paneItem.element.querySelectorAll(
        "input[type=\"checkbox\"]"
    );

    for (const checkbox of checkboxes) {
        if (
                !checkbox.classList.contains(checkboxClass)
                && !checkbox.classList.contains(toggleClass)
        ) {
            checkbox.classList.add(checkboxClass);
        }
    }
};

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
    injectedStylesFileRead = new Promise(function(resolve, reject) {
        fs.readFile(injectedStylesFilePath, "utf8", function(error, data) {
            if (error) {
                reject(error);
            }

            resolve(data);
        });
    });

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
