
import '@babel/polyfill';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import PrismaCms from "@prisma-cms/front";

import registerServiceWorker from './registerServiceWorker';

import App from "./App";

ReactDOM.render(<PrismaCms
  App={App}
/>, document.getElementById('root'));
registerServiceWorker();

