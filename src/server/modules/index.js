
import fs from "fs";

import chalk from "chalk";

import { fileLoader, mergeTypes } from 'merge-graphql-schemas';

import {CmsModule} from "@prisma-cms/server";

import UserProfileModule from "./userProfile";

class CoreModule extends CmsModule {
  


  constructor(options = {}) {

    let {
      modules = [],
    } = options;

    modules = modules.concat([
    ]);

    Object.assign(options, {
      modules,
    });

    super(options);

  }
  

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

  
  getApiSchema(types = []) {


    let apiSchema = super.getApiSchema(types, []);


    let schema = fileLoader(__dirname + '/schema/api/', {
      recursive: true,
    });

    apiSchema = mergeTypes([apiSchema.concat(schema)], { all: true });

    return apiSchema;

  }


  getExcludableApiTypes(){

    return [
    ];

  }


}


export default CoreModule;