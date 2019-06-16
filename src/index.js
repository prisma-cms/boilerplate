

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import PrismaCms from "@prisma-cms/front";

import * as serviceWorker from './serviceWorker';

import App, {
  queryFragments,
} from "./App";

import {
  UserNoNestingFragment,
} from "./schema/generated/api.fragments";

const node = document.getElementById('root');

if (node) {

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
  />, node);

  serviceWorker.unregister();

}

