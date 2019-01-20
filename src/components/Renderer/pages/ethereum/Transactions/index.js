import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Page from '../../layout';

import {
  TransactionsPage as BaseTransactionsPage,
} from "@prisma-cms/ethereum";


class TransactionsPage extends Page {


  setPageMeta(meta) {

    return super.setPageMeta(meta || {
      title: "Транзакции Ethereum",
      ...meta,
    });

  }


  render() {

    return super.render(<BaseTransactionsPage
      {...this.props}
    />);
  }
}


export default TransactionsPage;