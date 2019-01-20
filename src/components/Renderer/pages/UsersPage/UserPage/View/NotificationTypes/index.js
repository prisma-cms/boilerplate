import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';

import Typography from "material-ui/Typography";

import Context from "@prisma-cms/context";

const notificationsQuery = gql`
  query {
    objects: notificationTypes{
      id
      name
      comment
    }
  }
`;

class UserNotificationTypes extends Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    inEditMode: PropTypes.bool.isRequired,
    mutate: PropTypes.func.isRequired,
  };

  static contextType = Context;

  render() {

    const {
      data,
      user,
      inEditMode,
    } = this.props;

    const {
      user: currentUser,
      Grid,
      CheckBox,
    } = this.context;


    if (!user || !currentUser || user.id !== currentUser.id) {
      return null;
    }

    const {
      loading,
      objects,
    } = data;

    if (!objects || !objects.length) {
      return null;
    }

    const {
      NotificationTypes,
    } = user;


    let output = null

    output = objects.map(n => {

      const {
        id,
        name,
        comment,
      } = n;

      return <Grid
        key={id}
        item
        xs={12}
      >

        <CheckBox
          checked={NotificationTypes && NotificationTypes.findIndex(n => n.id === id) !== -1 ? true : false}
          label={comment || name}
          // disabled={!inEditMode}
          onChange={async event => {

            const {
              checked,
            } = event.target;

            // console.log("checked", checked);

            const {
              mutate,
            } = this.props;

            const action = checked ? "connect" : "disconnect";

            await mutate({
              variables: {
                data: {
                  NotificationTypes: {
                    [action]: {
                      id,
                    },
                  },
                },
              },
            });

          }}
        />
      </Grid>

    })

    return <Grid
      container
      spacing={8}
    >
      {output}
    </Grid>;
  }
}


export default compose(graphql(notificationsQuery))(UserNotificationTypes);