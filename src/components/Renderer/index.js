
import "../../styles/less/styles.css";

import React, { Fragment } from "react";

import { Renderer as PrismaCmsRenderer } from "@prisma-cms/front";
import GraphqlVoyagerPage from "@prisma-cms/front/lib/components/pages/GraphqlVoyager";

import {
  ContextProvider as SocietyContextProvider,
  SubscriptionProvider as SocietySubscriptionProvider,
} from "@prisma-cms/society";

import {
  ContextProvider as EthereumContextProvider,
  SubscriptionProvider as EthereumSubscriptionProvider,
} from "@prisma-cms/ethereum";

import Context from "@prisma-cms/context";

import ContextProvider from "./ContextProvider";

import { Link } from "react-router-dom";

// import UserPage from './pages/UsersPage/UserPage';

// import ChatRoomsPage from "./pages/society/ChatRooms";
// import ChatRoomPage from "./pages/society/ChatRooms/ChatRoom";
// import CreateChatRoomPage from "./pages/society/ChatRooms/ChatRoom/Create";

// import ChatMessagesPage from "./pages/society/ChatMessages";
// import ChatMessagePage from "./pages/society/ChatMessages/ChatMessage";

// import TransactionsPage from "./pages/ethereum/Transactions";
// import TransactionPage from "./pages/ethereum/Transactions/Transaction";

import MainMenu from "./MainMenu";

import {
  ContextProvider as WebrtcContextProvider,
  SubscriptionProvider as WebrtcSubscriptionProvider,
  WebRtcChatProvider,
} from "@prisma-cms/webrtc";

import {
  ContextProvider as FrontEditorContextProvider,
  SubscriptionProvider as FrontEditorSubscriptionProvider,
  // FrontEditorRoot,
} from "@prisma-cms/front-editor"

import TemplatesPage from "@prisma-cms/front-editor/lib/components/pages/Templates/"
import TemplatePage from "@prisma-cms/front-editor/lib/components/pages/Templates/Template"

import RootPage from "./pages/Root";

import * as queryFragments from "../../schema/generated/api.fragments";

export default class BoilerplateRenderer extends PrismaCmsRenderer {

  static defaultProps = {
    ...PrismaCmsRenderer.defaultProps,
    queryFragments,
  }


  renderMenu() {

    return <MainMenu />;
  }


  getRoutes() {

    const {
      getQueryFragment,
    } = this.context;

    let routers = super.getRoutes().concat([
      {
        exact: true,
        path: "/templates",
        component: TemplatesPage,
      },
      // {
      //   exact: true,
      //   path: "/templates/create",
      //   component: TemplateCreatePage,
      // },
      {
        exact: true,
        path: "/templates/:id",
        render: props => {

          const {
            match: {
              params: {
                id,
              },
            },
          } = props;

          return <TemplatePage
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
        path: "/graphql-voyager",
        component: GraphqlVoyagerPage,
      },
      {
        exact: false,
        path: "/",
        // component: FrontEditorRoot,
        // component: RootPage,
        render: props => {

          return <RootPage
            // {...props}
          />
        },
      },
    ]);

    return routers;
  }

  // getRoutes() {

  //   const {
  //     getQueryFragment,
  //   } = this.context;

  //   let routers = [
  //     {
  //       exact: true,
  //       path: "/users/:userId",
  //       render: (props) => {
  //         const {
  //           params,
  //         } = props.match;

  //         const {
  //           userId,
  //         } = params || {};

  //         return <UserPage
  //           key={userId}
  //           getQueryFragment={getQueryFragment}
  //           where={{
  //             id: userId,
  //           }}
  //           {...props}
  //         />
  //       }
  //     },
  //     {
  //       exact: true,
  //       path: "/",
  //       component: ChatRoomsPage,
  //     },
  //     {
  //       exact: true,
  //       path: "/chat-rooms",
  //       component: ChatRoomsPage,
  //     },
  //     {
  //       exact: true,
  //       path: "/chat-rooms/create",
  //       component: CreateChatRoomPage,
  //     },
  //     {
  //       exact: true,
  //       path: "/chat-rooms/:id",
  //       render: props => {

  //         const {
  //           match: {
  //             params: {
  //               id,
  //             },
  //           },
  //         } = props;

  //         return <ChatRoomPage
  //           key={id}
  //           where={{
  //             id,
  //           }}
  //           {...props}
  //         />
  //       },
  //     },
  //     {
  //       exact: true,
  //       path: "/chat-messages",
  //       component: ChatMessagesPage,
  //     },
  //     {
  //       exact: true,
  //       path: "/chat-messages/:id",
  //       render: props => {

  //         const {
  //           match: {
  //             params: {
  //               id,
  //             },
  //           },
  //         } = props;

  //         return <ChatMessagePage
  //           key={id}
  //           where={{
  //             id,
  //           }}
  //           {...props}
  //         />
  //       },
  //     },
  //     {
  //       exact: true,
  //       path: "/eth-transactions",
  //       render: props => <TransactionsPage
  //         {...props}
  //         where={{}}
  //         first={10}
  //         orderBy="createdAt_DESC"
  //       />
  //     },
  //     {
  //       exact: true,
  //       path: "/eth-transactions/:transactionId",
  //       component: TransactionPage,
  //     },
  //   ].concat(super.getRoutes());

  //   return routers;
  // }


  renderWrapper() {

    const {
      queryFragments,
    } = this.props;

    if(!queryFragments) {
      return null;
    }

    return <Context.Consumer>
      {context => {


        const {
          schema,
        } = context;


        if (!schema) {
          return null;
        }

        return <Context.Provider
          // value={Object.assign(context, this.context, {
          //   queryFragments,
          // })}
          value={{
            ...context,
            ...this.context,
            queryFragments,
          }}
        >
          <SocietyContextProvider>
            <SocietySubscriptionProvider>
              <EthereumContextProvider>
                <EthereumSubscriptionProvider>
                  <WebrtcContextProvider>
                    <WebrtcSubscriptionProvider>
                      <WebRtcChatProvider>
                        <FrontEditorContextProvider>
                          <FrontEditorSubscriptionProvider>
                            <ContextProvider>
                              {super.renderWrapper()}
                            </ContextProvider>
                          </FrontEditorSubscriptionProvider>
                        </FrontEditorContextProvider>
                      </WebRtcChatProvider>
                    </WebrtcSubscriptionProvider>
                  </WebrtcContextProvider>
                </EthereumSubscriptionProvider>
              </EthereumContextProvider>
            </SocietySubscriptionProvider>
          </SocietyContextProvider>
        </Context.Provider>
      }}
    </Context.Consumer>



  }


}

