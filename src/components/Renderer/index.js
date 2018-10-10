
import React from "react";

import { Renderer as PrismaCmsRenderer } from "@prisma-cms/front";

import {
  ProductsRoutes,
} from "../routes";

export default class BoilerplateRenderer extends PrismaCmsRenderer {

  
  getRoutes() {

    let routers = super.getRoutes();

    routers.unshift({
      exact: false,
      path: "/products",
      render: props => this.renderProducts(props),
    });

    return routers;

  }


  renderProducts(props) {

    return <ProductsRoutes
      {...props}
    />;
  }

}

