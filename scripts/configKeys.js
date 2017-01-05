const KEY_PREFIX = "really-black-ui.";

const KEY_SUFFIXES = [
    "secondaryBackgroundColor",
    "mainFontSize",
    "statusBarFontSize"
];

const configKeys = {};

for (keySuffix of KEY_SUFFIXES) {
    configKeys[keySuffix] = KEY_PREFIX + keySuffix;
}

module.exports = configKeys;
