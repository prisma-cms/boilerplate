
import startServer, {
  modifyArgs,
  paginationMiddleware,
} from "@prisma-cms/server";

import {
  getProjectFromRequest,
} from "@prisma-cms/marketplace-module";
import CoreModule from "./modules";

import Web3 from "web3";

// import URI from "urijs";

const coreModule = new CoreModule({
});

const resolvers = coreModule.getResolvers();
// console.log("resolvers", resolvers);

const GethServer = process.env.GethServer || "http://localhost:8545";

if (!GethServer) {
  throw new Error("Env GethServer required");
}

const web3 = new Web3(GethServer);
// web3.setProvider(new web3.providers.HttpProvider(GethServer));


/**
 * Получаем проект из запроса.
 * Это нужно для определения того, к какому конкретному проекту относится запрос
 */
// const getProjectFromRequest = async function (ctx) {

//   // console.log("ctx", ctx.request.headers);

//   const {
//     request: {
//       headers: {
//         origin,
//       },
//     },
//     db,
//   } = ctx;

//   if (!origin) {
//     return;
//   }

//   const uri = new URI(origin);

//   const domain = uri.domain();

//   if (!domain) {
//     return;
//   }

//   // console.log("ctx domain", domain);

//   return await db.query.project({
//     where: {
//       domain,
//     },
//   });
// }


const middlewares = [
  paginationMiddleware,
];


startServer({
  typeDefs: 'src/schema/generated/api.graphql',
  resolvers,
  middlewares,
  contextOptions: {
    web3,
    getProjectFromRequest,
    modifyArgs,
    resolvers,
    // debug: true,
  },
});


