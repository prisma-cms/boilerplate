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
import Language from "@prisma-cms/front/lib/components/Language";
// import UserItem from "./User";

import { Link } from "react-router-dom";
import { Notices } from '@prisma-cms/society';
// import { IconButton } from 'material-ui';

// import Context from "@prisma-cms/context";
import PrismaCmsComponent from "@prisma-cms/component";

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


export const locales = {
  ru: {
    values: {
      "Signin": "Войти",
      "Signout": "Выход",
      "Chats": "Чаты",
      "Users": "Участники",
      "Ethereum": "Ethereum",
      "API Schema": "API схема",
    }
  },
};


export class MainMenu extends PrismaCmsComponent {

  // static contextType = Context;

  static propTypes = {
    ...PrismaCmsComponent.propTypes,
    classes: PropTypes.object.isRequired,
  };


  static defaultProps = {
    ...PrismaCmsComponent.defaultProps,
    locales,
  }

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
          spacing={16}
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
                Prisma-CMS
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
                {this.lexicon("Chats")}
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
                {this.lexicon("Users")}
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
                {this.lexicon("Ethereum")}
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
                {this.lexicon("API Schema")}
              </Typography>
            </a>

          </Grid>

          <Grid
            item
          >
            <a
              href="/api/"
              rel="noindex,nofollow"
              target="_blank"
            >
              <Typography>
                {this.lexicon("Query Builder")}
              </Typography>
            </a>

          </Grid>


          <Grid
            item
            xs
          >
          </Grid>


          <Language
          />

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
                  {this.lexicon("Signout")}
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
                {this.lexicon("Signin")}
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
