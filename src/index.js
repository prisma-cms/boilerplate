import React from 'react';
import ReactDOM from 'react-dom';

import App from "@prisma-cms/core/front/src";

import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

