
import fs from "fs";

import chalk from "chalk";

import { fileLoader, mergeTypes } from 'merge-graphql-schemas';

import {CmsModule} from "@prisma-cms/server";

import ECommerceModule from "@prisma-cms/e-commerce";

import RouteModule from "@prisma-cms/router";

// console.log("RouteModule", RouteModule);

class RouterModuleExtended extends RouteModule{


  getRouteComponentTypes(types = []) {

    types = types.concat([
      "Product",
      "ProductsCategory",
    ]);
    
    return super.getRouteComponentTypes(types); 

  }
}


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
      ECommerceModule,
      RouterModuleExtended,
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

  async denyEditUser(args, ctx) {

    const {
      where,
    } = args;

    const user = await ctx.db.query.user({
      where,
    });

    const {
      denyEdit,
    } = user || {};

    if (denyEdit === true) {
      throw new Error("Нельзя редактировать этого пользователя");
    }

  }


  getResolvers() {

    // console.log("getResolvers");

    const resolvers = super.getResolvers();

    const {
      resetPassword,
      updateUserProcessor,
    } = resolvers.Mutation


    Object.assign(resolvers.Query, {
    });


    Object.assign(resolvers.Mutation, {

      resetPassword: async (source, args, ctx, info) => {

        await this.denyEditUser(args, ctx);

        return resetPassword(source, args, ctx, info);
      },

      updateUserProcessor: async (source, args, ctx, info) => {

        await this.denyEditUser(args, ctx);

        return updateUserProcessor(source, args, ctx, info);
      },

    });


    Object.assign(resolvers, {
    });


    return resolvers;
  }


}


export default CoreModule;