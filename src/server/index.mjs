
import startServer, {
  modifyArgs,
  paginationMiddleware,
} from "@prisma-cms/server";

import {
  getProjectFromRequest,
} from "@prisma-cms/marketplace-module";
import CoreModule from "./modules";
// import permissions from './middleware/permissions';

import Web3 from "web3";

// import URI from "urijs";

const coreModule = new CoreModule({
});

const resolvers = coreModule.getResolvers();
// console.log("resolvers", resolvers);

const {
  SendmailTest,
} = process.env;

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
  // permissions,
  paginationMiddleware,
];


const sendmailOptions = {};

if (SendmailTest === 'true') {
  Object.assign(sendmailOptions, {
    smtpPort: 1025,
    smtpHost: 'mail',
    devHost: 'mail',
  });
}


startServer({
  typeDefs: 'src/schema/generated/api.graphql',
  resolvers,
  middlewares,
  sendmailOptions,
  // MailerProps: {
  //   mailSender: "no-reply@my-host",
  //   footer: `<p>Regards,<br /> 
  //   Administration <a href="https://my-host">my-host/a></p>`,
  // },
  contextOptions: {
    web3,
    getProjectFromRequest,
    modifyArgs,
    resolvers,
    // debug: true,
  },
});


