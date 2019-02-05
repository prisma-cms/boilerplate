import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
// import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
// import IconButton from 'material-ui/IconButton';


// import CreateIcon from 'material-ui-icons/Create';


import UserItem from "@prisma-cms/front/lib/components/App/Renderer/MainMenu/User";
import { styles as defaultStyles } from "@prisma-cms/front/lib/components/App/Renderer/MainMenu";
// import UserItem from "./User";

import { Link } from "react-router-dom";
import { Notices } from '@prisma-cms/society';
// import { IconButton } from 'material-ui';

import Context from "@prisma-cms/context";

import {
  CallRequestButtons,
} from "@prisma-cms/webrtc";

export const styles = theme => {

  const {
    palette: {
      background: {
        default: backgroundColor,
      },
    },
  } = theme;

  return {
    ...defaultStyles,
    root: {
      // flexGrow: 1,
      backgroundColor,
      position: "relative",
    },
    flex: {
      flex: 1,
    },
    menuButton: {
      marginLeft: 5,
      // marginRight: -12,
    },
    fullWidth: {
      width: "100%",
    },
  }
};

export class MainMenu extends Component {

  static contextType = Context;

  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  render() {

    const {
      classes,
      ...other
    } = this.props;


    const {
      user: currentUser,
      logout,
      router: {
        history,
      },
      Grid,
    } = this.context;

    const {
      id: userId,
    } = currentUser || {}

    return (
      <AppBar
        // position="static"
        color="default"
        className={classes.root}
      >

        <Grid
          container
          alignItems="center"
          spacing={8}
        >
          <Grid
            item
            xs={12}
            sm
          >
            <Link
              to="/"
            >
              <Typography
                variant="title"
                // color="inherit"
                className={classes.link}
              >
                Crypto Trader
              </Typography>
            </Link>

          </Grid>

          <Grid
            item
          >
            <Link
              to="/chat-rooms"
            >
              <Typography
                component="span"
                className={classes.link}
              >
                Чаты
                </Typography>
            </Link>
          </Grid>

          <Grid
            item
          >
            <Link
              to="/users"
            >
              <Typography>
                Участники
                </Typography>
            </Link>

          </Grid>

          <Grid
            item
          >
            <Link
              to="/eth-transactions"
            >
              <Typography>
                Ethereum
                </Typography>
            </Link>

          </Grid>

          <Grid
            item
          >
            <a
              href="/graphql-voyager"
              rel="noindex,nofollow"
            >
              <Typography>
                Схема
                </Typography>
            </a>

          </Grid>

          <Grid
            item
          >
            <a
              href="/api"
              rel="noindex,nofollow"
              target="_blank"
            >
              <Typography>
                API
                </Typography>
            </a>

          </Grid>


          <Grid
            item
            xs
          >
          </Grid>

          {currentUser ?
            <Grid
              key="callRequests"
              item
            >
              <CallRequestButtons
                key={userId}
                classes={{
                  icon: classes.link,
                }}
              />
            </Grid>
            : null
          }

          {currentUser ?
            <Grid
              key="notifications"
              item
            >
              <Notices
                key={userId}
                user={currentUser}
                classes={{
                  icon: classes.link,
                }}
              />
            </Grid>
            : null
          }

          {currentUser
            ?
            <Fragment>

              <Grid
                key="user"
                item
              >
                <UserItem
                  key={userId}
                  user={currentUser}
                  classes={classes}
                />
              </Grid>
              <Grid
                key="logout"
                item
              >
                <Button
                  onClick={() => logout()}
                  className={classes.link}
                  size="small"
                >
                  Выход
                </Button>

              </Grid>
            </Fragment>
            :
            <Grid
              key="login"
              item
            >
              <Button
                onClick={e => {
                  // this.setState({
                  //   opened: true,
                  // });
                  const {
                    openLoginForm,
                  } = this.context;
                  openLoginForm();
                }}
                className={classes.link}
                size="small"
              >
                Войти
              </Button>

            </Grid>
          }
        </Grid>

      </AppBar>
    );
  }
}


export default withStyles(styles)(props => <MainMenu
  {...props}
/>);
