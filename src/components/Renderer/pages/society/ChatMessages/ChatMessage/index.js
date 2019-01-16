import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Page from "../../../layout";

import {
  ChatMessage,
} from "@prisma-cms/society";


class ChatMessagePage extends Page {

  render() {

    return super.render(
      <ChatMessage
        {...this.props}
      />
    );
  }
}


export default ChatMessagePage;