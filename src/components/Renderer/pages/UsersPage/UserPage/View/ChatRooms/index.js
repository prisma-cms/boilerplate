import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import {
  ChatRooms as ChatRoomsProto,
  NewMessage,
} from "@prisma-cms/society";

import Context from "@prisma-cms/context";
import { Typography } from 'material-ui';
import { withStyles } from 'material-ui';

const styles = theme => {

  return {
    message: {
      padding: "0px !important",
    },
  }
}


class ChatRooms extends ChatRoomsProto {

  setPageMeta(){

    return;
  }
  
}


class ChatRoomsByUser extends Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    currentUser: PropTypes.object,
  };

  static contextType = Context;

  render() {

    const {
      user,
      currentUser,
      classes,
    } = this.props;


    const {
      id: userId,
      username,
      fullname,
    } = user || {};

    if (!userId) {
      return null;
    }

    const {
      id: currentUserId,
    } = currentUser || {};

    let sendMessage;

    if (!currentUserId || (currentUserId !== userId)) {

      sendMessage = <div>

        <Typography
          variant="subheading"
        >
          Отправить пользователю приватное сообщение
        </Typography>

        <NewMessage
          cacheKey={`newMessage_${userId}`}
          data={{
            Room: {
              to: userId,
            },
          }}
          onSave={result => {

            // console.log("result", result);

            const {
              response,
            } = result && result.data || {};

            const {
              Room,
            } = response && response.data || {};

            const {
              id: rootId,
            } = Room;

            if (rootId) {
              const {
                router: {
                  history,
                },
              } = this.context;

              history.push(`/chat-rooms/${rootId}`);
            }

          }}
          classes={{
            root: classes.message,
          }}
        />
      </div>

    }

    return (
      <Fragment>

        {sendMessage}

        <ChatRooms
          where={{
            Members_some: {
              id: userId,
            },
          }}
          title={`Чат-комнаты с пользователем ${fullname || username}`}
        />

      </Fragment>
    );
  }
}


export default withStyles(styles)(props => <ChatRoomsByUser
  {...props}
/>);