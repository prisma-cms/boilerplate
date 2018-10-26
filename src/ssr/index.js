/* eslint consistent-return:0 */

const path = require('path');

const basepath = process.cwd();
 
['.css', '.less', '.sass', '.ttf', '.woff', '.woff2', '.svg', '.png'].forEach((ext) => require.extensions[ext] = () => { });


let SSRmiddlewareClass = require('./SSR');

let SSRmiddleware = new SSRmiddlewareClass().middleware;

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

const setupProxy = require("@prisma-cms/front/lib/setupProxy");

setupProxy(app);

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

