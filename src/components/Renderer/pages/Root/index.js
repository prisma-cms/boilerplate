import React from 'react';

import PrismaCmsComponent from "@prisma-cms/component";
import RootConnector from '@prisma-cms/front-editor/lib/components/Root';
import UserPage from './components/pages/Users/User';
// import PdfView from './components/PdfView';
import CreateUserPage from './components/pages/Users/User/Create';
import ChatRooms from './components/pages/ChatRooms';
import NoticesMenu from './components/society/NoticesMenu';
import ChatRoom from './components/pages/ChatRooms/ChatRoom';
import CallRequestButtons from './components/webrtc/CallRequestButtons';



class RootPage extends PrismaCmsComponent {

  render() {

    const {
      CustomComponents = [],
      ...other
    } = this.props;

    return <RootConnector
      CustomComponents={CustomComponents.concat([
        NoticesMenu,
        UserPage,
        CreateUserPage,
        ChatRooms,
        ChatRoom,
        // PdfView,
        CallRequestButtons,
      ])}
      {...other}
    />
  }

}

export default RootPage;