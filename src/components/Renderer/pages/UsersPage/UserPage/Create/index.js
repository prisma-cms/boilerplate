import React, { Component } from 'react';
import PropTypes from 'prop-types';

import View from "../View";

// import Context from "@prisma-cms/context";
import PrismaCmsComponent from "@prisma-cms/component";

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class CreateUserPage extends PrismaCmsComponent {

  // static contextType = Context;


  // componentWillMount() {

  //   console.log("this.context", this.context);

  //   const {
  //     query: {
  //       createUserProcessor,
  //     },
  //   } = this.context;

  //   this.createUser = gql(createUserProcessor);

  //   super.componentWillMount && super.componentWillMount();
  // }


  createUser = async (props) => {

    // console.log("props", { ...props });

    const {
      query: {
        createUserProcessor,
      },
    } = this.context;

    // this.createUser = gql(createUserProcessor);

    return this.mutate({
      mutation: gql(createUserProcessor),
      ...props,
    });


  }


  onSave = result => {

    // console.log("result", result);

    const {
      response,
    } = result && result.data || {};

    const {
      id: userId,
    } = response && response.data || {};

    if (userId) {
      const {
        router: {
          history,
        },
      } = this.context;

      history.push(`/users/${userId}`);
    }

  }


  render() {


    // const {
    //   query: {
    //     createUserProcessor,
    //   },
    // } = this.context;

    const {
      ...other
    } = this.props;

    return super.render(
      <View
        data={{
          object: {},
        }}
        _dirty={{
        }}
        mutate={this.createUser}
        onSave={this.onSave}
        {...other}
      />
    );
  }

}


export default CreateUserPage;