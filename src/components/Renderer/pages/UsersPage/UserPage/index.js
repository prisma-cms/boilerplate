import React, { Component } from 'react';
import PropTypes from 'prop-types';

import UserPageProto from "@prisma-cms/front/lib/modules/pages/UsersPage/UserPage";


import View from "./View";


class UserPage extends UserPageProto {

  static defaultProps = {
    ...UserPageProto.defaultProps,
    View,
  }

}


export default UserPage;