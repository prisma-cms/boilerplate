

import expect from 'expect'

import React, { Component } from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import PropTypes from "prop-types";

import TestApp from "../App";
import chalk from 'chalk';
 
const pathname = "/users";
  

class Renderer extends Component {

  static propTypes = {
    pathname: PropTypes.string.isRequired,
    title: PropTypes.string,
  } 

  constructor(props) {

    super(props);

    const {
      pathname,
      title,
    } = props; 

    window.history.pushState({}, title, pathname); 

  }

  render() {

    return <TestApp
      {...this.props}
    />

  }
}

const testText = "test";


describe('@prisma-cms/boilerplate users page test', () => {
  let node


  beforeEach(() => {
    node = document.createElement('div')
  })

  afterEach(() => {
    unmountComponentAtNode(node)
  })



  it('Render main page', () => {

    render(<Renderer
      lang="ru"
      pathname={"/"}
      // title="Main page"
    > 
    </Renderer>, node, () => {

      const {
        document: {
          title,
          status,
        },
      } = global;
 
      const item = node.querySelector("#test");

      expect(global.window.location.pathname).toEqual("/");
      expect(title).toEqual("Main page");

      expect(testText).toContain(item && item.textContent || "")
      // return false
    })
  });


  it('Render users page', () => {

    render(<Renderer
      lang="ru"
      pathname={pathname}
      title="Users"
    > 
    </Renderer>, node, () => {

      const {
        document: {
          title,
          status,
        },
      } = global; 

      const item = node.querySelector("#test");

      expect(global.window.location.pathname).toEqual(pathname);
      expect("Users").toEqual(title);

      expect(testText).toContain(item && item.textContent || "")
      // return false
    })
  });


  let userPageUrl = "/users/cjmtayev000ex0a5028xzq7b1";

  if(userPageUrl){

    it('Render user page', () => {
  
      render(<Renderer
        lang="ru"
        pathname={userPageUrl}
      > 
      </Renderer>, node, () => {
  
        const {
          document: {
            title,
            status,
          },
        } = global; 
  
        const item = node.querySelector("#test");
  
        expect(userPageUrl).toEqual(global.window.location.pathname);
        // expect("Users").toEqual(title);
  
        expect(testText).toContain(item && item.textContent || "")
        // return false
      })
    });
    
  }



})

