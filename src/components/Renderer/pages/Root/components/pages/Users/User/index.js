import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EditorComponent from "@prisma-cms/front-editor/lib/components/App/components/";

// import Icon from "material-ui-icons/SettingsOverscan";

import CustomUserPage from "../../../../../UsersPage/UserPage";

class UserPage extends EditorComponent {

  // static defaultProps = {
  //   ...EditorComponent.defaultProps,
  //   marginTop: 10,
  //   marginBottom: 10,
  // }

  static Name = "UserPage"

  renderPanelView() {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(<div
      className={classes.panelButton}
    >
      {/* <Icon />  */}
      User page
    </div>);
  }


  renderChildren() {

    // const {
    //   ...other
    // } = this.getComponentProps(this);


    const {
      parent,
    } = this.props;

    if (!parent) {
      return false;
    }

    const {
      props: {
        match,
      },
    } = parent;

    // console.log("getComponentProps match", { ...match });

    const {
      params: where,
    } = match || {};

    if (!where) {
      return null;
    }

    return <CustomUserPage
      where={where}
    />;
  }

}

export default UserPage;
