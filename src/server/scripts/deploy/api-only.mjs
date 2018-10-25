// require('@babel/register')({
//   extensions: ['.js'],
//   "presets": [
//     "@babel/preset-env",
//     "@babel/preset-react"
//   ],
//   "plugins": [
//     "transform-es2015-modules-commonjs",
//     "@babel/plugin-proposal-class-properties"
//   ],

// });

// require("@babel/polyfill");

import { 
  buildApiSchema,
} from "./"

import { generateSchema }from "../../../schema";

buildApiSchema(generateSchema);
