

// const CoreModule = require("./modules").default;
// const coreModule = new CoreModule({
// });
// const resolvers = coreModule.getResolvers();

// const imagesMiddleware = require("./middleware/ImageThumb");


// switch (process.env.action) {

//   case "build-schema":

//     require("./schema").default(process.env.schemaType);

//     break;

//   case "start-server":

//     const startServer = require("@prisma-cms/server").default;


//     startServer({
//       typeDefs: 'src/schema/generated/api.graphql',
//       resolvers,
//       imagesMiddleware,
//     });

//     break;

// }




import startServer from "@prisma-cms/server";

// console.log("startServer", startServer);

// const CoreModule = require("./modules").default;

import CoreModule from "./modules";
// console.log("CoreModule", CoreModule);

const coreModule = new CoreModule({
});

const resolvers = coreModule.getResolvers();


import imagesMiddleware from "./middleware/ImageThumb";


switch (process.env.action) {

  case "start-server":

    // const startServer = require("@prisma-cms/server").default;


    startServer({
      typeDefs: 'src/schema/generated/api.graphql',
      resolvers,
      imagesMiddleware,
    });

    break;

}


