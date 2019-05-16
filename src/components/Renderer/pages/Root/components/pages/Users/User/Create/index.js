import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EditorComponent from "@prisma-cms/front-editor/lib/components/App/components/";

// import Icon from "material-ui-icons/SettingsOverscan";

import CustomCreateUserPage from "../../../../../../UsersPage/UserPage/Create";

class CreateUserPage extends EditorComponent {

  // static defaultProps = {
  //   ...EditorComponent.defaultProps,
  //   marginTop: 10,
  //   marginBottom: 10,
  // }

  static Name = "CreateUserPage"

  renderPanelView() {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(<div
      className={classes.panelButton}
    >
      {/* <Icon />  */}
      Create User page
    </div>);
  }


  renderChildren() {

    return <CustomCreateUserPage
    />;
  }


}

export default CreateUserPage;
