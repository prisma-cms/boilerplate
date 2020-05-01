import React from 'react';

import EditorComponent from '@prisma-cms/front-editor/lib/components/App/components/';

import {
  CallRequestButtons as WebRtcCallRequestButtons,
} from '@prisma-cms/webrtc';

export class CallRequestButtons extends EditorComponent {

  static Name = 'CallRequestButtons';

  static defaultProps = {
    ...EditorComponent.defaultProps,
    hide_wrapper_in_default_mode: true,
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
        CallRequestButtons
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

    // const {
    // } = this.context;

    // const {
    // } = this.getEditorContext();

    // const {
    //   ...other
    // } = this.getComponentProps(this);

    // return super.renderChildren();

    return <WebRtcCallRequestButtons
      key="CallRequestButtons"
    />
  }

}

export default CallRequestButtons;