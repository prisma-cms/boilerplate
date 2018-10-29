 

import chalk from "chalk";

import {PrismaModule} from "../";

import path from 'path';
import MergeSchema from 'merge-graphql-schemas';
const { fileLoader, mergeTypes } = MergeSchema
const moduleURL = new URL(import.meta.url);
const __dirname = path.dirname(moduleURL.pathname);

 

class InnerModule extends PrismaModule {
 
 
  getSchema(types = []) {
 

    let schema = fileLoader(__dirname + '/schema/database/', {
      recursive: true,
    });


    console.log(chalk.green("schema"), schema);


    if(schema){
      types = types.concat(schema);
    }


    let typesArray = super.getSchema(types);

    return typesArray;

  }


  // getApiSchema(types = []) {

  //   let schema = fileLoader(__dirname + '/schema/api/', {
  //     recursive: true,
  //   });

  //   // apiSchema = mergeTypes([apiSchema.concat(schema)], { all: true });


  //   return schema;

  // }



  
  getExcludableApiTypes() {

    return super.getExcludableApiTypes([
      // "UserCreateInput",
      // "User",
      // "EnumFields",
    ]);

  }


}
 

export default InnerModule;
 