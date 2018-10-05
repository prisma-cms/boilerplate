
import fs from "fs";

import chalk from "chalk";

import { fileLoader, mergeTypes } from 'merge-graphql-schemas';

import {CmsModule} from "@prisma-cms/server";


class CoreModule extends CmsModule {

  getSchema(types = []) {

    let schema = fileLoader(__dirname + '/schema/database/', {
      recursive: true,
    });


    if (schema) {
      types = types.concat(schema);
    }


    let typesArray = super.getSchema(types);

    return typesArray;

  }

}


export default CoreModule;