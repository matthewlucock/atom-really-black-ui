const KEY_PREFIX = "really-black-ui.";

const KEY_SUFFIXES = [
    "mainFontSize",
    "statusBarFontSize"
];

const configKeys = {};

for (keySuffix of KEY_SUFFIXES) {
    configKeys[keySuffix] = KEY_PREFIX + keySuffix;
}

module.exports = configKeys;
