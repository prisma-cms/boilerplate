

import gql from "graphql-tag";

import { split, from } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { setContext } from 'apollo-link-context';

import { ApolloClient } from 'apollo-client';

import {
  InMemoryCache,
  // IntrospectionFragmentMatcher
} from 'apollo-cache-inmemory';

if (typeof window !== undefined) {


  // const httpUri = "http://localhost:4000";

  // const wsUri = "ws://localhost:4000";


  const createClient = function(httpUri, wsUri){



    // 1. Create Apollo Link that's connected to the underlying GraphQL API
    const httpLink = new HttpLink({
      uri: httpUri,
    });


    // Auth link
    const httpAuthLink = setContext((request, previousContext) => ({
      headers: {
        Authorization: localStorage && localStorage.token || undefined,
      },
    }));

    global.httpAuthLink = httpAuthLink;

    // WebSocket link
    const wsLink = new WebSocketLink({
      uri: wsUri,
      options: {
        reconnect: true,
        connectionParams: () => ({
          Authorization: localStorage && localStorage.token || undefined,
          // Authorization: new Date().getMilliseconds().toString(),
        }),
      },
    });


    // global.wsLink = wsLink


    // const subscriptionMiddleware = {
    //   applyMiddleware(options, next) {
    //     //   options.auth = { 
    //     //     sdf: "SDfsdf",
    //     //   }
    //     Object.assign(options, {
    //       // auth: {
    //       //   Authorization: localStorage && localStorage.token || undefined,
    //       // },
    //     });
    //     next()
    //   }
    // }
    // // add the middleware to the web socket link via the Subscription Transport client
    // wsLink.subscriptionClient.use([subscriptionMiddleware])


    const link = split(
      // split based on operation type
      ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
      },
      wsLink,
      from([
        httpAuthLink,
        httpLink,
      ]),
    );

    // global.link = link;

    const cache = new InMemoryCache({
      // fragmentMatcher: new IntrospectionFragmentMatcher({
      //   introspectionQueryResultData: fragmentTypes
      // })
    });

    const client = new ApolloClient({
      link,
      cache,
    });

    return client;
  }


  // const subscribe = () => {


  //   /**
  //    * Подписываемся на уведомления
  //    */
  //   const subscribeNotices = gql`
  //     subscription notice2 (
  //       $where: NoticeSubscriptionWhereInput
  //     ){
  //       response: notice(
  //         where: $where
  //       ){
  //         mutation
  //         node {
  //           id
  //           createdAt
  //         }
  //       }
  //     }
  //   `;

  //   client
  //     .subscribe({
  //       query: subscribeNotices,
  //       variables: {
  //         where: {
  //         },
  //       },
  //     })
  //     .subscribe({
  //       next: (result) => {
  //         console.log("subscribe result 2", result);
  //       }
  //     })
  //     ;

  // }

  // global.subscribe = subscribe;


  Object.assign(window, {
    // client,
    createClient,
    gql,
    // wsLink,
  });


}

