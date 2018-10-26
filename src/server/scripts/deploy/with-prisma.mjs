
import {
  deploy,
} from "./";

import { generateSchema } from "./schema"


try {
  deploy(generateSchema)
}
catch (error) {
  console.error("error", error);
};

