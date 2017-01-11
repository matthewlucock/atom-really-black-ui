const Color = require("color");

const GIT_TEXT_COLOR_DARKEN_AMOUNT = 0.5;
const GIT_TEXT_COLORS = new Map([
    ["added", "#73c990"],
    ["modified", "#e2c08d"],
    ["removed", "#ff6347"],
    ["renamed", "#6494ed"],
    ["ignored", "#b3b3b3"]
]);

const makeContrastedTextColorFunction = function(options) {
    return function(colorToContrast) {
        if (colorToContrast.dark()) {
            return options.lightColor;
        } else {
            return options.darkColor;
        }
    };
};

const getMainTextColorFromBackground = makeContrastedTextColorFunction({
    lightColor: "white",
    darkColor: "black"
});

const getGitTextColorsFromBackground = {};

for (const [functionName, textColor] of GIT_TEXT_COLORS) {
    const fn = makeContrastedTextColorFunction({
        lightColor: textColor,
        darkColor: Color(textColor).darken(GIT_TEXT_COLOR_DARKEN_AMOUNT).hex()
    });

    getGitTextColorsFromBackground[functionName] = fn;
}

module.exports = {
    GIT_TEXT_COLORS,
    getMainTextColorFromBackground,
    getGitTextColorsFromBackground,
    themeHasActivated: false
}
