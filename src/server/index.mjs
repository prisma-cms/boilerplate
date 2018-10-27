
import startServer from "@prisma-cms/server";
import CoreModule from "./modules";
import { ImagesMiddleware } from "@prisma-cms/upload-module";


const coreModule = new CoreModule({
});

const resolvers = coreModule.getResolvers();

const imagesMiddleware = new ImagesMiddleware().processRequest;


startServer({
  typeDefs: 'src/schema/generated/api.graphql',
  resolvers,
  imagesMiddleware,
});


