/* eslint-env node */

const fs = require("fs");
const path = require("path");

// External libraries

const { contains, join, map, pipe, replace, toLower } = require("ramda");
const elmStaticHtml = require("elm-static-html-lib").default;

// Utilities

const pretty = x => JSON.stringify(x, null, `  `);
const trace = (...rest) => console.log(`> `, ...rest);
const fail = (...rest) => console.error(`> `, rest);

const joinCompact = join(``);

const generatePageMarkup = ({ body }) => joinCompact([
    `<!DOCTYPE html>`,
    `<html lang="en">`,
    `<head>`,
        `<meta charset="utf-8">`,
        `<title>Markdown Demo</title>`,
        `<meta http-equiv="X-UA-Compatible" content="IE=edge">`,
        //<link href="favicon.ico" rel="shortcut icon" type="image/x-icon" />-
        `<meta name="viewport" content="width=device-width, user-scalable=yes, initial-scale=1.0, minimum-scale=1.0"/>`,
    `</head>`,
    `<body>`,
    `${body}`,
    `</body>`,
    `</html>`,
]);

const render = moduleName => (
    elmStaticHtml(__dirname, `${moduleName}.view`, {
        decoder: `${moduleName}.decodeModel`,
        indent: 0,
        model: { who: `World` },
    }).then(generatedHtml => {
        const filePathRaw = `${moduleName}.html`

        const filePath = toLower(filePathRaw);
        const fileDir = path.dirname(filePath);

        if (!fs.existsSync(fileDir)) {
            trace(`creating directory "${fileDir}"...`)
            fs.mkdirSync(fileDir);
        }

        trace(`generating "${moduleName}" at "${filePath}"...`);

        try {
            fs.writeFile(
                filePath,
                generatePageMarkup({
                    body: generatedHtml,
                }),
                `utf-8`
            );
        } catch (e) {
            fail(`Failed generating "${moduleName}".`);
            throw e;
        }
    }).catch(err => fail(err.message))
);

render(`Home`);
render(`Styled`);
