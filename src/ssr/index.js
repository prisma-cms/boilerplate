/* eslint consistent-return:0 */

const path = require('path');

const basepath = process.cwd();

require('@babel/register')({
  extensions: ['.js'],
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react"
  ],
  "plugins": [
    "transform-es2015-modules-commonjs",
    "@babel/plugin-proposal-class-properties"
  ],

  ignore: [function (filename) {

    return filename.indexOf(basepath + `/node_modules/`) === 0;
  }],

});

['.css', '.less', '.sass', '.ttf', '.woff', '.woff2', '.svg', '.png', '.jpg', '.jpeg', '.gif'].forEach((ext) => require.extensions[ext] = () => { });

require('@babel/polyfill');

const fs = require("fs");

let SSRmiddlewareClass = require('./SSR');

let SSRmiddleware = new SSRmiddlewareClass({
  rootSelector: "#root",
}).middleware;

const ws = require('ws');

global.WebSocket = ws;

const express = require('express');

const argv = require('minimist')(process.argv.slice(2));
const app = express();

var bodyParser = require('body-parser');

const cwd = process.cwd();


const setupProxy = require("../setupProxy");

setupProxy(app);


app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(bodyParser.json());       // to support JSON-encoded bodies


app.get("/static/js/voyager.worker.js", (req, res, next) => {
  res.sendFile(`${cwd}/node_modules/@prisma-cms/graphql-voyager/dist/voyager.worker.js`);
});

/**
 * Process static files
 */
app.get("**", (req, res, next) => {

  const {
    pathname,
  } = req._parsedUrl;

  if (pathname && pathname !== "/") {

    const path = `${cwd}/build${pathname}`;

    if (fs.existsSync(path)) {
      // Do something
      return res.sendFile(path);
    }

  }

  next();
});

app.get('**', (req, res, next) => {

  return SSRmiddleware(req, res, next);
});

// app.get('/', express.static(cwd + '/build')); //Serves resources from build folder
// app.use('/static', express.static(cwd + '/build/static')); //Serves resources from build folder
// app.use('/build', express.static(cwd + '/build')); //Serves resources from build folder
// app.use('/public', express.static(cwd + '/public')); //Serves resources from public folder
// app.get('/favicon.ico', express.static(cwd + '/build')); //Serves resources from build folder
// app.get('/manifest.json', express.static(cwd + '/build')); //Serves resources from build folder
// app.get('/service-worker.js', express.static(cwd + '/build')); //Serves resources from build folder




// get the intended port number, use port 3000 if not provided
const port = argv.port || process.env.PORT || 3000;

// Start your app.
app.listen(port, (err) => {
  if (err) {
    // return logger.error(err.message);
    console.error(err);
  }
  // logger.appStarted(port);
  console.log("Server started");
});

