// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from '../../App';
// import PrismaCms from "@prisma-cms/front";

// it('renders without crashing', () => {
//   const div = document.createElement('div');
//   ReactDOM.render(<PrismaCms
//     App={App}
//   />, div);
//   ReactDOM.unmountComponentAtNode(div);
// });

import expect from 'expect'

import React, { Component } from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import PropTypes from "prop-types";

import TestApp from "./App";
import chalk from 'chalk';



class Renderer extends Component {

  static propTypes = {
  }

  render() {

    return <div
      id="content"
      {...this.props}
    />

  }
}

const testText = "test";

describe('@prisma-cms/boilerplate test', () => {
  let node


  beforeEach(() => {
    node = document.createElement('div')
  })

  afterEach(() => {
    unmountComponentAtNode(node)
  })



  it('Render Main App', () => {
 

    render(<TestApp
      Renderer={Renderer}
      lang="ru"
    > 
      {testText}
    </TestApp>, node, () => {

      console.log(chalk.green("TestComponentFiltersSetted result node"), node.innerHTML);

      const item = node.querySelector("#test");

      expect(testText).toContain(item && item.textContent || "")
    })
  });



})

