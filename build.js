/*eslint no-console: "off"*/

"use strict";
const fs = require("fs");

const eslint = require("eslint");
const less = require("less");

const LESS_PATHS = [
    "styles/customisable/general.less",
    "styles/customisable/editor.less"
];
const DESTINATION_CSS_PATH = "styles/customisable/compiled.css";

const linter = new eslint.CLIEngine;
const lintFormatter = linter.getFormatter("stylish");
const lintReport = linter.executeOnFiles(["build.js", "scripts"]);
console.log(lintFormatter(lintReport.results));

const lessToParse = LESS_PATHS
    .map(filePath => fs.readFileSync(filePath, "utf8"))
    .join("")
    .replace(/@([^\s;)]+)/g, "\"$1\"");

less.render(lessToParse, {compress: true})
    .then(function(output) {
        fs.writeFileSync(DESTINATION_CSS_PATH, output.css);
    });
