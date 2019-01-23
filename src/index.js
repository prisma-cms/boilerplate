

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import PrismaCms from "@prisma-cms/front";

import "./client";

import * as serviceWorker from './serviceWorker';

import App, {
  queryFragments,
} from "./App";

import {
  UserNoNestingFragment,
} from "./schema/generated/api.fragments";

import  './hello.worker.js';

ReactDOM.render(<PrismaCms
  App={App}
  apolloOptions={{
    apiQuery: `{
      user:me{
        ...UserNoNesting
        EthAccounts {
          id
          address
          balance(convert:ether)
        }
      } 
    }
    ${UserNoNestingFragment}
    `,
  }}
  queryFragments={queryFragments}
/>, document.getElementById('root'));

serviceWorker.register();

// const helloWorker = new HelloWorker();
// let messageCount = 0;

// helloWorker.postMessage({ run: true });

// helloWorker.onmessage = event => {
//   if (event.data.status) {
//     console.log('STATUS', event.data.status);
//   }

//   if (event.data.message) {
//     messageCount += 1;
//     console.log('MESSAGE', event.data.message);

//     if (messageCount >= 5) {
//       helloWorker.postMessage({ run: false });
//     }
//   }

// }

