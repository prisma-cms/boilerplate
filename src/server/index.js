const cwd = process.cwd();

// require("babel-register")({
//   ignore: function (filename) {

//     const relativePath = filename.replace(cwd, "");

//     return /^\/node_modules\//.test(relativePath);
//   },
// });

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

  // ignore: function(filename) {
  //   // console.log('filename', filename);
  //   // if (filename === "/path/to/es6-file.js") {
  //   if (filename === "/path/to/es6-file.js") {
  //     return false;
  //   } else {
  //     return true;
  //   }
  //   return true;
  // },
});

require("@babel/polyfill");


switch (process.env.action) {

  case "build-schema":

    require("./schema").default(process.env.schemaType);

    break;

  case "start-server":


    // require("./server");
    const {default : server} = require("@prisma-cms/server/src/server");

    server({
      typeDefs: 'src/server/schema/generated/api.graphql',
    });

    break;

  default: throw (new Error("action env not defined"))

}


