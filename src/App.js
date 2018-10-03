

import { Component } from "react";

import PrismaApp from "@prisma-cms/front/lib/components/App";

import Renderer from "./components/Renderer";

export default class App extends PrismaApp {

  static defaultProps = {
    ...PrismaApp.defaultProps,
    Renderer,
  }

}
