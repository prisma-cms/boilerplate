
const chalk = require("chalk");

// const basepath = process.cwd();

// require('@babel/polyfill');

// require('@babel/register')({
//   extensions: ['.js'],
//   // presets: ['react', "es2015"],
//   // presets: ["es2015"],
//   // presets: ['react'],
//   // presets: [ "es2015", "react", "stage-0"],
//   "presets": [
//     "@babel/preset-env",
//     // "@babel/preset-react"
//   ],
//   "plugins": [
//     // "transform-ensure-ignore"
//     "transform-es2015-modules-commonjs",
//     "@babel/plugin-proposal-class-properties"
//   ],

//   ignore: [function (filename) {

//     return filename.indexOf(basepath + `/node_modules/`) === 0;
//   }],

// });



it('renders without crashing', () => {
  return new Promise((resolve, reject) => {

    try{
      const server = require("../../server");
      
      // console.log(chalk.green("Server imported success"));

      resolve("Server imported success");
    }
    catch(error){
      reject(error);
    }

  });
});
