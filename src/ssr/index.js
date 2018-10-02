
// require ("../src/node_modules/cms/front/ssr");


/* eslint consistent-return:0 */

const path = require('path');

const basepath = process.cwd();

// console.log('process.cwd', process.cwd());
// console.log('process.env.PWD', process.env.PWD);

// return ;

require('@babel/register')({
  extensions: ['.js'],
  // presets: ['react', "es2015"],
  // presets: ["es2015"],
  // presets: ['react'],
  // presets: [ "es2015", "react", "stage-0"],
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react"
  ],
  "plugins": [
    // "transform-ensure-ignore"
    "transform-es2015-modules-commonjs",
    "@babel/plugin-proposal-class-properties"
  ],
  // ignore: /\/prisma\/node_modules\//,

  ignore: [function (filename) {
    // console.log(filename.indexOf(basepath + `/node_modules/`));

    return filename.indexOf(basepath + `/node_modules/`) === 0;
  }],

  // ignore: function(filename) {
  //   // console.log('filename', filename);
  //   // if (filename === "/path/to/es6-file.js") {
  //   if (filename === "/path/to/es6-file.js") {
  //     return false;
  //   } else {
  //     return true;
  //   }
  //   return true;
  // },
});

['.css', '.less', '.sass', '.ttf', '.woff', '.woff2', '.svg'].forEach((ext) => require.extensions[ext] = () => { });
// ['.css', '.less', '.sass', '.ttf', '.woff', '.woff2'].forEach((ext) => require.extensions[ext] = () => {});
require('@babel/polyfill');

let SSRmiddlewareClass = require('@prisma-cms/core/front/ssr/SSR');

let SSRmiddleware = new SSRmiddlewareClass({
  typeDefs: 'src/server/schema/generated/api.graphql',
}).middleware;

const ws = require('ws');

global.WebSocket = ws;

const express = require('express');
// const logger = require('./logger');

const argv = require('minimist')(process.argv.slice(2));
// const setup = require('./middlewares/frontendMiddleware');
const isDev = process.env.NODE_ENV !== 'production';
const resolve = require('path').resolve;
const app = express();

var bodyParser = require('body-parser');

const cwd = process.cwd();

const proxy = require('http-proxy-middleware');


app.use(proxy('/api/', {
  target: 'http://localhost:4000/',
  ws: true,
  pathRewrite: {
    "^/api/": "/"
  }
}));

app.use(proxy('/images/', {
  target: 'http://localhost:4000/',
  pathRewrite: {
    "^/images/resized/([^/]+)/uploads/(.+)": "/images/$1/$2",
  }
}));


app.use('/static', express.static(cwd + '/build/static')); //Serves resources from build folder
app.use('/build', express.static(cwd + '/build')); //Serves resources from build folder
app.use('/public', express.static(cwd + '/public')); //Serves resources from public folder

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(bodyParser.json());       // to support JSON-encoded bodies


app.get('**', SSRmiddleware);

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



