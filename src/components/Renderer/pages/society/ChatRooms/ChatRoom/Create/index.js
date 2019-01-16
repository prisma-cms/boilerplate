import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Page from "../../../../layout";

import {
  CreateChatRoom,
} from "@prisma-cms/society";


class CreateChatRoomPage extends Page {


  setPageMeta() {

    return super.setPageMeta({
      title: "Создать новую чат-комнату",
    });

  }


  render() {

    return super.render(
      <CreateChatRoom
        {...this.props}
      />
    );
  }
}


export default CreateChatRoomPage;