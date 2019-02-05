
import "../../styles/less/styles.css";

import React from "react";

import { Renderer as PrismaCmsRenderer } from "@prisma-cms/front";

import {
  ContextProvider as SocietyContextProvider,
  SubscriptionProvider as SocietySubscriptionProvider,
} from "@prisma-cms/society";

import {
  ContextProvider as EthereumContextProvider,
  SubscriptionProvider as EthereumSubscriptionProvider,
} from "@prisma-cms/ethereum";

import ContextProvider from "./ContextProvider";

import UserPage from './pages/UsersPage/UserPage';

import ChatRoomsPage from "./pages/society/ChatRooms";
import ChatRoomPage from "./pages/society/ChatRooms/ChatRoom";
import CreateChatRoomPage from "./pages/society/ChatRooms/ChatRoom/Create";

import ChatMessagesPage from "./pages/society/ChatMessages";
import ChatMessagePage from "./pages/society/ChatMessages/ChatMessage";

import TransactionsPage from "./pages/ethereum/Transactions";
import TransactionPage from "./pages/ethereum/Transactions/Transaction";

import MainMenu from "./MainMenu";

import {
  ContextProvider as WebrtcContextProvider,
  SubscriptionProvider as WebrtcSubscriptionProvider,
  WebRtcChatProvider,
} from "@prisma-cms/webrtc";


export default class BoilerplateRenderer extends PrismaCmsRenderer {


  renderMenu() {

    return <MainMenu />;
  }


  getRoutes() {

    const {
      getQueryFragment,
    } = this.context;

    let routers = [
      {
        exact: true,
        path: "/users/:userId",
        render: (props) => {
          const {
            params,
          } = props.match;

          const {
            userId,
          } = params || {};

          return <UserPage
            key={userId}
            getQueryFragment={getQueryFragment}
            where={{
              id: userId,
            }}
            {...props}
          />
        }
      },
      {
        exact: true,
        path: "/",
        component: ChatRoomsPage,
      },
      {
        exact: true,
        path: "/chat-rooms",
        component: ChatRoomsPage,
      },
      {
        exact: true,
        path: "/chat-rooms/create",
        component: CreateChatRoomPage,
      },
      {
        exact: true,
        path: "/chat-rooms/:id",
        render: props => {

          const {
            match: {
              params: {
                id,
              },
            },
          } = props;

          return <ChatRoomPage
            key={id}
            where={{
              id,
            }}
            {...props}
          />
        },
      },
      {
        exact: true,
        path: "/chat-messages",
        component: ChatMessagesPage,
      },
      {
        exact: true,
        path: "/chat-messages/:id",
        render: props => {

          const {
            match: {
              params: {
                id,
              },
            },
          } = props;

          return <ChatMessagePage
            key={id}
            where={{
              id,
            }}
            {...props}
          />
        },
      },
      {
        exact: true,
        path: "/eth-transactions",
        render: props => <TransactionsPage
          {...props}
          where={{}}
          first={10}
          orderBy="createdAt_DESC"
        />
      },
      {
        exact: true,
        path: "/eth-transactions/:transactionId",
        component: TransactionPage,
      },
    ].concat(super.getRoutes());

    return routers;
  }


  renderWrapper() {

    return <SocietyContextProvider>
      <SocietySubscriptionProvider>
        <EthereumContextProvider>
          <EthereumSubscriptionProvider>
            <WebrtcContextProvider>
              <WebrtcSubscriptionProvider>
                <WebRtcChatProvider>
                  <ContextProvider>
                    {super.renderWrapper()}
                  </ContextProvider>
                </WebRtcChatProvider>
              </WebrtcSubscriptionProvider>
            </WebrtcContextProvider>
          </EthereumSubscriptionProvider>
        </EthereumContextProvider>
      </SocietySubscriptionProvider>
    </SocietyContextProvider>

  }


}

