const cwd = process.cwd();

require('@babel/register')({
  extensions: ['.js'],
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react"
  ],
  "plugins": [
    "transform-es2015-modules-commonjs",
    "@babel/plugin-proposal-class-properties"
  ],

  ignore: [function (filename) {

    return filename.indexOf(cwd + `/node_modules/`) === 0;
  }],
});

require("@babel/polyfill");


const CoreModule = require("./modules").default;
const coreModule = new CoreModule({
});
const resolvers = coreModule.getResolvers();


switch (process.env.action) {

  case "build-schema":

    require("./schema").default(process.env.schemaType);

    break;

  case "start-server":


    const server = require("@prisma-cms/server/lib/server");

    server({
      typeDefs: 'src/server/schema/generated/api.graphql',
      resolvers,
    });

    break;

  // default: throw (new Error("action env not defined"))

}


