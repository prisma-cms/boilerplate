import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import PrismaCmsComponent from "@prisma-cms/component";
import RootConnector from '@prisma-cms/front-editor/lib/components/Root';
import UserPage from './components/pages/Users/User';
// import PdfView from './components/PdfView';
import CreateUserPage from './components/pages/Users/User/Create';



class RootPage extends PrismaCmsComponent {

  render() {

    const {
      CustomComponents = [],
      ...other
    } = this.props;

    return <RootConnector
      CustomComponents={CustomComponents.concat([
        UserPage,
        CreateUserPage,
        // PdfView,
      ])}
      {...other}
    />
  }

}

export default RootPage;