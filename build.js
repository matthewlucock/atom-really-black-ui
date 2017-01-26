/* eslint no-console: "off", no-process-exit: "off" */
"use strict";

const fs = require("fs");

const eslint = require("eslint");
const less = require("less");

const LESS_PATHS = [
    "styles/customisable/general.less",
    "styles/customisable/editor.less"
];
const DESTINATION_CSS_PATH = "styles/customisable/compiled.css";

const SCRIPTS_TO_LINT = [
    "build.js",
    "scripts"
];

const linter = new eslint.CLIEngine;
const lintFormatter = linter.getFormatter("stylish");
const lintReport = linter.executeOnFiles(SCRIPTS_TO_LINT);
console.log(lintFormatter(lintReport.results));

if (lintReport.errorCount) {
    process.exit(1);
}

const lessToParse = LESS_PATHS
    .map(filePath => fs.readFileSync(filePath, "utf8"))
    .join("")
    .replace(/@([^\s;)]+)/g, "\"$1\"");

less.render(lessToParse, {compress: true})
    .then(output => {
        fs.writeFileSync(DESTINATION_CSS_PATH, output.css);
    });
