

// import PrismaModule from "@prisma-cms/prisma-module";

import ResourceModule, {
} from "@prisma-cms/resource-module";


class ResourceModuleCustom extends ResourceModule {


  getSchema() {

    return;
  }


  getApiSchema(types = []) {


    return;

  }


  // injectWhereUnique(where) {

  //   let {
  //     uri,
  //   } = where || {};

  //   /**
  //    * Если указан ури, но не начинается со слеша, то добавляем слеш
  //    */
  //   if (uri && !uri.startsWith("/")) {
  //     where.uri = `/${uri}`;
  //   }

  //   return where;

  // }


  getResolvers() {

    let resolvers = super.getResolvers();

    const {
      // Query: {
      //   resource,
      //   ...Query
      // },
      Resource,
      ...other
    } = resolvers;



    return {
      ...other,
      // Query: {
      //   ...Query,
      //   resource: async (source, args, ctx, info) => {

      //     // console.log("resource args", args);

      //     const {
      //       modifyArgs,
      //     } = ctx;

      //     const {
      //       where,
      //     } = args;

      //     /**
      //      * Во фронт-редакторе пока что недоработка с обработкой УРЛов (точнее запросов от роутера,
      //      * нельзя задать path: ":uri", можно только path: "/:uri*"),
      //      * поэтому приходится добавлять в начало слеш, если не указан.
      //      */
      //     modifyArgs(where, this.injectWhereUnique, info);

      //     return resource(source, args, ctx, info);
      //   },
      // },
      Resource: {
        ...Resource,
        Comments: (source, args, ctx, info) => {

          const {
            id,
            Comments,
          } = source;

          return id ? ctx.db.query.resources({
            where: {
              CommentTarget: {
                id,
              },
            },
          }, info)
            : Comments;
        },
      },
    };

  }

}


export default ResourceModuleCustom;