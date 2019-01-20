import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Page from '../../../layout';

import {
  TransactionPage as BaseTransactionPage,
} from "@prisma-cms/ethereum";


class TransactionPage extends Page {

  render() {

    return super.render(<BaseTransactionPage
      {...this.props}
    />);
  }
}


export default TransactionPage;