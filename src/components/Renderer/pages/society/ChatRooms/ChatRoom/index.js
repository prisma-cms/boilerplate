import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Page from "../../../layout";

import {
  ChatRoom,
} from "@prisma-cms/society";


class ChatRoomPage extends Page {


  // setPageMeta() {

  //   return super.setPageMeta({
  //     title: "Чаты",
  //   });

  // }


  render() {

    return super.render(
      <ChatRoom
        {...this.props}
      />
    );
  }
}


export default ChatRoomPage;