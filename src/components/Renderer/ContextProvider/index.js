
import React, {
  Component,
} from 'react';


import Context from '@prisma-cms/context';

import * as UI from "../ui"

class ContextProvider extends Component {

  static contextType = Context;


  render() {

    const {
      children,
    } = this.props;

    let {
      query,
    } = this.context;

    Object.assign(this.context, {
      query: {
        ...query,
        ...this.prepareQuery(),
      },
      ...UI,
    });

    return <Context.Provider
      value={this.context}
    >
      {children || null}
    </Context.Provider>;

  }


  prepareQuery() {

    return {
      ...this.prepareUserQuery(),
    }

  }


  prepareUserQuery() {
    const {
      queryFragments,
    } = this.context;


    const {
      UserNoNestingFragment,
      EthAccountNoNestingFragment,
      NotificationTypeNoNestingFragment,
      BatchPayloadNoNestingFragment,
    } = queryFragments;


    const userFragment = `
      fragment user on User {
        ...UserNoNesting
        EthAccounts{
          ...EthAccountNoNesting
        }
        NotificationTypes{
          ...NotificationTypeNoNesting
        }
      }

      ${UserNoNestingFragment}
      ${EthAccountNoNestingFragment}
      ${NotificationTypeNoNestingFragment}
    `;


    const usersConnection = `
      query usersConnection (
        $where: UserWhereInput
        $orderBy: UserOrderByInput
        $skip: Int
        $after: String
        $before: String
        $first: Int
        $last: Int
      ){
        objectsConnection: usersConnection (
          where: $where
          orderBy: $orderBy
          skip: $skip
          after: $after
          before: $before
          first: $first
          last: $last
        ){
          aggregate{
            count
          }
          edges{
            node{
              ...user
            }
          }
        }
      }

      ${userFragment}
    `;


    const users = `
      query users (
        $where: UserWhereInput
        $orderBy: UserOrderByInput
        $skip: Int
        $after: String
        $before: String
        $first: Int
        $last: Int
      ){
        objects: users (
          where: $where
          orderBy: $orderBy
          skip: $skip
          after: $after
          before: $before
          first: $first
          last: $last
        ){
          ...user
        }
      }

      ${userFragment}
    `;


    const user = `
      query user (
        $where: UserWhereUniqueInput!
      ){
        object: user(
          where: $where
        ){
          ...user
        }
      }

      ${userFragment}
    `;


    const createUserProcessor = `
      mutation createUserProcessor(
        $data: UserCreateInput!
      ) {
        response: createUserProcessor(
          data: $data
        ){
          success
          message
          errors{
            key
            message
          }
          data{
            ...user
          }
        }
      }

      ${userFragment}
    `;


    const updateUserProcessor = `
      mutation updateUserProcessor(
        $data: UserUpdateInput!
        $where: UserWhereUniqueInput
      ) {
        response: updateUserProcessor(
          data: $data
          where: $where
        ){
          success
          message
          errors{
            key
            message
          }
          data{
            ...user
          }
        }
      }

      ${userFragment}
    `;


    const deleteUser = `
      mutation deleteUser (
        $where: UserWhereUniqueInput!
      ){
        deleteUser(
          where: $where
        ){
          ...UserNoNesting
        }
      }
      ${UserNoNestingFragment}
    `;


    const deleteManyUsers = `
      mutation deleteManyUsers (
        $where: UserWhereInput
      ){
        deleteManyUsers(
          where: $where
        ){
          ...BatchPayloadNoNesting
        }
      }
      ${BatchPayloadNoNestingFragment}
    `;


    return {
      usersConnection,
      users,
      user,
      createUserProcessor,
      updateUserProcessor,
      deleteUser,
      deleteManyUsers,
    }
  }



}

export default ContextProvider;