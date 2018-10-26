
const chalk = require("chalk");



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
