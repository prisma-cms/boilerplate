
import startServer from "@prisma-cms/server";
import CoreModule from "./modules";


const coreModule = new CoreModule({
});

const resolvers = coreModule.getResolvers();


startServer({
  typeDefs: 'src/schema/generated/api.graphql',
  resolvers,
});


