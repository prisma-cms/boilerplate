

import { Component } from "react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import {App as PrismaApp} from "@prisma-cms/front";

import Renderer from "./components/Renderer";

import * as queryFragments from "./schema/generated/api.fragments";

export {
  Renderer,
  queryFragments,
}

export default class App extends PrismaApp {

  static defaultProps = {
    ...PrismaApp.defaultProps,
    Renderer,
    queryFragments,
    // lang: "ru",
    themeOptions: {
      direction: 'ltr',
      paletteType: 'light',
    },
  }

}
