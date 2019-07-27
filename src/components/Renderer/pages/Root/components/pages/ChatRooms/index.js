import React from 'react';

import EditorComponent from '@prisma-cms/front-editor/lib/components/App/components/';
import ChatRoomsPage from '../../../../society/ChatRooms';

export class ChatRooms extends EditorComponent {

  static Name = 'ChatRooms';

  static defaultProps = {
    ...EditorComponent.defaultProps,
  }


  renderPanelView(content) {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(
      content ||
      <div
        className={classes.panelButton}
      >
        ChatRooms
      </div>
    );
  }


  getRootElement() {

    return super.getRootElement();
  }


  canBeParent(parent) {

    return super.canBeParent(parent);
  }


  canBeChild(child) {

    // return super.canBeChild(child);
    return false;
  }


  renderChildren() {

    const {
    } = this.context;

    const {
    } = this.getEditorContext();

    const {
      ...other
    } = this.getComponentProps(this);

    // return super.renderChildren();

    return <ChatRoomsPage
      {...other}
    />
  }

}

export default ChatRooms;