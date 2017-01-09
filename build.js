const readFile = require("fs-readfile-promise");
const writeFile = require("fs-writefile-promise");
const less = require("less");

readFile("styles/injected-styles.less", "utf8")
    .then(function(lessToParse) {
        return less.render(lessToParse);
    })
    .then(function(output) {
        return writeFile("injected-styles.css", output.css);
    });
