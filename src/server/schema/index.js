
import generateSchema from "react-cms-schema";

import CoreModule from "../modules";


export default function(schemaType){

  return generateSchema(schemaType, new CoreModule(), __dirname);
}
