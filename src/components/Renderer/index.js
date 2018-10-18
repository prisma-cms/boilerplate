
import React from "react";

import { Renderer as PrismaCmsRenderer } from "@prisma-cms/front";


export default class BoilerplateRenderer extends PrismaCmsRenderer {
  
  getRoutes() {

    let routers = super.getRoutes();

    return routers;
  }

}

