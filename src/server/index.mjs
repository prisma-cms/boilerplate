
import startServer from "@prisma-cms/server";
import CoreModule from "./modules";

import Web3 from "web3";

const coreModule = new CoreModule({
});

const resolvers = coreModule.getResolvers();
// console.log("resolvers", resolvers);

const GethServer = process.env.GethServer || "http://localhost:8545";

if(!GethServer){
  throw("Env GethServer required");
}

const web3 = new Web3(GethServer);
// web3.setProvider(new web3.providers.HttpProvider(GethServer));

startServer({
  typeDefs: 'src/schema/generated/api.graphql',
  resolvers,
  contextOptions: {
    web3,
  },
});


