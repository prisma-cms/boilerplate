

import { Component } from "react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import {App as PrismaApp} from "@prisma-cms/front";

import Renderer from "./components/Renderer";

export {
  Renderer,
}

export default class App extends PrismaApp {

  static defaultProps = {
    ...PrismaApp.defaultProps,
    Renderer,
    // lang: "ru",
    themeOptions: {
      direction: 'ltr',
      paletteType: 'light',
    },
  }

}
