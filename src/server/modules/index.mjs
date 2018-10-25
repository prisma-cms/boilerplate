
import fs from "fs";

import chalk from "chalk";
 

import MergeSchema from 'merge-graphql-schemas';

import {CmsModule} from "@prisma-cms/server";


import path from 'path';

const moduleURL = new URL(import.meta.url);

const __dirname = path.dirname(moduleURL.pathname);

const { fileLoader, mergeTypes } = MergeSchema;

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
    
    this.mergeModules([
      // RouterModuleExtended,
    ]);

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

    return super.getExcludableApiTypes([
    ]);

  }


}


export default CoreModule;