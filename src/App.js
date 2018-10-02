

import { Component } from "react";

import PrismaApp from "@prisma-cms/front/src/components/App";

import Renderer from "./components/Renderer";

export default class App extends PrismaApp {

  static defaultProps = {
    ...PrismaApp.defaultProps,
    Renderer,
  }

}
