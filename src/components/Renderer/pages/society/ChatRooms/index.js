import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Page from "../../layout";

import {
  ChatRooms,
} from "@prisma-cms/society";


class ChatRoomsPage extends Page {


  setPageMeta() {

    return super.setPageMeta({
      title: "Чаты",
    });

  }


  render() {

    return super.render(
      <ChatRooms
        {...this.props}
      />
    );
  }
}


export default ChatRoomsPage;