import React, { Component } from 'react';
import PropTypes from 'prop-types';

import UserPageProto from "@prisma-cms/front/lib/components/pages/UsersPage/UserPage";


import View from "./View";

import Page from "../../layout";


class UserPage extends Page {

  static defaultProps = {
    ...Page.defaultProps,
    View,
  }

  render() {

    return super.render(<UserPageProto
      {...this.props}
    />);
  }

}


export default UserPage;