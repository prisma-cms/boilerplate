
import chalk from "chalk";

import CmsModule from "../../../../../server/modules";

import InnerModule from "./innerModule";


import path from 'path';
import MergeSchema from 'merge-graphql-schemas';

const { fileLoader, mergeTypes } = MergeSchema
const moduleURL = new URL(import.meta.url);
const __dirname = path.dirname(moduleURL.pathname);


class TestModule extends CmsModule {


  constructor(options = {}) {

    super(options);

    this.mergeModules([
      // RouterModuleExtended,
      InnerModule,
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

    /**
     * Hack for imitate = "src/schema/generated/prisma.graphql";
     */
    let baseSchema = this.getSchema();

    // console.log("baseSchema", baseSchema);

    let apiSchema = super.getApiSchema(types.concat([baseSchema]), []);

    // console.log(chalk.green("TestModule apiSchema"), apiSchema);


    let schema = fileLoader(__dirname + '/schema/api/', {
      recursive: true,
    });

    // apiSchema = mergeTypes([apiSchema.concat(schema).concat(baseSchema)], { all: true });
    apiSchema = mergeTypes([apiSchema.concat(schema)], { all: true });

    return apiSchema;

  }


  getExcludableApiTypes() {

    return super.getExcludableApiTypes([
      // "UserCreateInput",
      // "User",
      // "EnumFields",
    ]);

  }


}


export {
  CmsModule as PrismaModule,
}

export default TestModule;
