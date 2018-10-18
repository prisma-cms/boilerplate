
import prismaGenerateSchema from "@prisma-cms/prisma-schema";

import CoreModule from "../server/modules";


export const generateSchema = function(schemaType){

  return prismaGenerateSchema(schemaType, new CoreModule(), __dirname);
}

export default generateSchema;