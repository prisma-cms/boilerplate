
import prismaGenerateSchema from "@prisma-cms/prisma-schema";

import CoreModule from "../../modules";
 

import path from 'path';
import chalk from "chalk";
 

export const generateSchema = function (schemaType) {

  let result;

  try {

    const moduleURL = new URL(import.meta.url);
    const basedir = path.join(path.dirname(moduleURL.pathname), "/../../../", "schema/")


    result = prismaGenerateSchema(schemaType, new CoreModule(), basedir);
  }
  catch (error) {

    console.log(chalk.red("generateSchema Error"), error);
  }

  return result;

}

export default generateSchema;