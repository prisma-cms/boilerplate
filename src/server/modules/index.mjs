
import fs from "fs";

import chalk from "chalk";


import MergeSchema from 'merge-graphql-schemas';

import { CmsModule } from "@prisma-cms/server";


import LogModule from "@prisma-cms/log-module";
import UserModule from "@prisma-cms/user-module";
import MailModule from "@prisma-cms/mail-module";
import UploadModule from "@prisma-cms/upload-module";


import path from 'path';

const moduleURL = new URL(import.meta.url);

const __dirname = path.dirname(moduleURL.pathname);

const { fileLoader, mergeTypes } = MergeSchema;

class CoreModule extends CmsModule {



  constructor(options = {}) {

    super(options);

    this.mergeModules([
      UserModule,
      LogModule,
      MailModule,
      UploadModule,
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


  getApiSchema(types = [], excludeTypes = []) {


    let apiSchema = super.getApiSchema(types, excludeTypes.concat([
    ]));


    let schema = fileLoader(__dirname + '/schema/api/', {
      recursive: true,
    });

    apiSchema = mergeTypes([apiSchema.concat(schema)], { all: true });

    return apiSchema;

  }


}


export default CoreModule;