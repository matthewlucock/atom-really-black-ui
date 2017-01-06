const readFile = require("fs-readfile-promise");
const writeFile = require("fs-writefile-promise");
const less = require("less");

const compileLess = function(lessToCompile) {
    return new Promise(function(resolve, reject) {
        less.render(lessToCompile, function(error, output) {
            if (error === undefined || error === null) {
                resolve(output.css);
            } else {
                reject(error);
            }
        });
    });
};

readFile("styles/injected-styles.less", "utf8")
    .then(compileLess)
    .then(writeFile.bind(undefined, "injected-styles.css"));
