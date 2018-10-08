
import chalk from "chalk";

import { fileLoader, mergeTypes } from 'merge-graphql-schemas';

import PrismaModule from "@prisma-cms/prisma-module";


class RouteModule extends PrismaModule {


  // constructor(options = {}) {

  //   let {
  //     modules = [],
  //   } = options;

  //   modules = modules.concat([
  //   ]);

  //   Object.assign(options, {
  //     modules,
  //   });

  //   super(options);

  // }


  getSchema(types = []) {

    let schema = fileLoader(__dirname + '/schema/database/', {
      recursive: true,
    });

    if (schema) {
      types = types.concat(schema);
    }


    let routeComponentTypes = this.getRouteComponentTypes();

    types.push(routeComponentTypes);


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


  getRouteComponentTypes(types = []) {

    types = types.concat([
      "Resource",
    ]);

    return `
      enum RouteComponent{
        ${types.join(",\n")}
      }
    `;
  }


  // getExcludableApiTypes(){

  //   return super.getExcludableApiTypes([
  //   ]);

  // }


  getResolvers() {

    const resolvers = super.getResolvers();

    Object.assign(resolvers.Query, {
      route: this.route,
      routesConnection: this.routesConnection,
    });

    Object.assign(resolvers.Mutation, {
    });

    Object.assign(resolvers, {
    });

    return resolvers;
  }


  route(source, args, ctx, info) {

    return ctx.db.query.route({}, info);
  }


  routesConnection(source, args, ctx, info) {

    return ctx.db.query.routesConnection({}, info);
  }


}


export default RouteModule;