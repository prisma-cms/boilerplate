
import generateSchema from "@prisma-cms/prisma-schema";

import CoreModule from "../modules";


export default function(schemaType){

  return generateSchema(schemaType, new CoreModule(), __dirname);
}
