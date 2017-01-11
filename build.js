const readFile = require("fs-readfile-promise");
const writeFile = require("fs-writefile-promise");
const less = require("less");

readFile("styles/customisable-styles.less", "utf8")
    .then(function(lessToParse) {
        lessToParse = lessToParse.replace(/@([^\s;\)]+)/g, "\"$1\"");
        return less.render(lessToParse, {compress: true});
    })
    .then(function(output) {
        return writeFile("styles/customisable-styles.css", output.css);
    });
