
import chalk from "chalk";

import { fileLoader, mergeTypes } from 'merge-graphql-schemas';

import PrismaModule from "@prisma-cms/prisma-module";


class ECommerceModule extends PrismaModule {

 


  getResolvers() {

    // console.log("getResolvers");

    const resolvers = super.getResolvers();

    Object.assign(resolvers.Query, {
      products: this.products,
      productsConnection: this.productsConnection,
    });


    Object.assign(resolvers.Mutation, {
    });


    Object.assign(resolvers, {
    });


    return resolvers;
  }


  products(source, args, ctx, info) {

    return ctx.db.query.products({}, info);
  }


  productsConnection(source, args, ctx, info) {

    return ctx.db.query.productsConnection({}, info);
  }


  // products(source, args, ctx, info) {

  //   console.log("products args", args);

  //   return [
  //     {
  //       __typename: "ProductType1",
  //       id: 234,
  //       name: "DSfsdf",
  //     },
  //     {
  //       __typename: "ProductType2",
  //       id: 234,
  //       name: "FDGhfgdhd",
  //     },
  //     {
  //       __typename: "ProductType3",
  //       id: 2434,
  //       name: "rgSDasd",
  //     },
  //   ];
  // }


}


export default ECommerceModule;