import React, { Component } from 'react';
import PropTypes from "prop-types";

import PrismaCmsApp from '@prisma-cms/front'


export const userFragment = `
  fragment user on User {
    id
    username
  }
`;

export const queryFragments = {
  UserNoNestingFragment: userFragment
}


export default class TestApp extends Component {

  static propTypes = {
    // Renderer: PropTypes.func.isRequired,
    queryFragments: PropTypes.object.isRequired,
  }

  static defaultProps = {
    // Renderer,
    queryFragments,
  }

  render() {

    const {
      Renderer,
      queryFragments,
      ...other
    } = this.props;

    return <PrismaCmsApp
      Renderer={Renderer}
      queryFragments={queryFragments}
      {...other}
    />
  }
}

it("", () => {})

