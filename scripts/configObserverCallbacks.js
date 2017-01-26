"use strict";

const mapAssign = require("map-assign");

const styleInjection = require("./styleInjection");
const util = require("./util");

const DONT_STYLE_THE_EDITOR_CLASS = "really-black-ui-dont-style-the-editor";

const secondaryColor = secondaryColor => {
    secondaryColor = util.handleAtomColor(secondaryColor);

    const variables = util.generateVariablesFromSecondaryColor(secondaryColor);

    mapAssign(styleInjection.styleVariables, variables);
};

const mainFontSize = fontSize => {
    styleInjection.styleVariables.set("main-font-size", `${fontSize}px`);
};

const statusBarFontSize = fontSize => {
    styleInjection.styleVariables.set("status-bar-font-size", fontSize);
};

const styleTheEditor = value => {
    styleInjection.styleVariables.set("style-the-editor", value);

    if (value) {
        document.body.classList.remove(DONT_STYLE_THE_EDITOR_CLASS);
    } else {
        document.body.classList.add(DONT_STYLE_THE_EDITOR_CLASS);
    }
};

module.exports = {
    secondaryColor,
    mainFontSize,
    statusBarFontSize,
    styleTheEditor
};
