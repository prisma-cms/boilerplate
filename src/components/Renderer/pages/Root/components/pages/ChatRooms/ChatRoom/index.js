import React from 'react';

import EditorComponent from '@prisma-cms/front-editor/lib/components/App/components/';
import { ObjectContext } from '@prisma-cms/front-editor/lib/components/App/components/public/Connectors/Connector/ListView/';
import ChatRoomView from '@prisma-cms/webrtc/lib/components/pages/society/ChatRooms/ChatRoom/View';
import { EditableObjectContext } from '@prisma-cms/front-editor/lib/components/App/context';

export class ChatRoom extends EditorComponent {

  static Name = 'ChatRoom';

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
        ChatRoom
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

    return super.canBeChild(child);
  }


  renderChildren() {

    const {
    } = this.context;

    const {
    } = this.getEditorContext();

    const {
      ...other
    } = this.getComponentProps(this);

    return <EditableObjectContext.Consumer>
      {objectContext => {

        const {
          object,
          ...otherContext
        } = objectContext;


        return <ChatRoomView
          {...otherContext}
          data={{
            object: object,
          }}
        />

      }}
    </EditableObjectContext.Consumer>

    return `super.renderChildren()`;
  }

}

export default ChatRoom;