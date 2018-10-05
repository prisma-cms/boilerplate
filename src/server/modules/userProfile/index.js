
import PrismaModule from "@prisma-cms/prisma-module";

import { fileLoader, mergeTypes } from 'merge-graphql-schemas';

export default class UserProfile extends PrismaModule {

  getSchema(types = []) {

    let schema = fileLoader(__dirname + '/schema/database/', {
      recursive: true,
    });


    if (schema) {
      types = types.concat(schema);
    }
    
    const extendedType = `
      type UserProfile {
        displayName: String
      }
    `;
    
    types = types.concat([extendedType]);


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


  getExcludableApiTypes() {

    return [
    ];

  }

}