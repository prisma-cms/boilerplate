
import prismaGenerateSchema from "@prisma-cms/prisma-schema";

import CoreModule from "../server/modules";

import path from 'path';

const moduleURL = new URL(import.meta.url);

const __dirname = path.dirname(moduleURL.pathname);

export const generateSchema = function(schemaType){

  return prismaGenerateSchema(schemaType, new CoreModule(), __dirname);
}

export default generateSchema;