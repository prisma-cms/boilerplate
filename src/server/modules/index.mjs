
import fs from "fs";

import chalk from "chalk";


import MergeSchema from 'merge-graphql-schemas';

import { CmsModule } from "@prisma-cms/server";


import LogModule from "@prisma-cms/log-module";
// import UserModule from "@prisma-cms/user-module";
import UserModule from "./user";
import MailModule from "@prisma-cms/mail-module";
import UploadModule from "@prisma-cms/upload-module";
import RouterModule from "@prisma-cms/router-module";
import SocietyModule from "@prisma-cms/society-module";
import EthereumModule from "@prisma-cms/ethereum-module";


import { parse, print } from "graphql";
import path from 'path';

const moduleURL = new URL(import.meta.url);

const __dirname = path.dirname(moduleURL.pathname);

const { fileLoader, mergeTypes } = MergeSchema;


class CoreModule extends CmsModule {


  constructor(options = {}) {

    super(options);

    this.mergeModules([
      LogModule,
      MailModule,
      UploadModule,
      RouterModule,
      SocietyModule,
      EthereumModule,
      UserModule,
    ]);

  }


  getSchema(types = []) {

    let schema = fileLoader(__dirname + '/schema/database/', {
      recursive: true,
    });


    if (schema) {
      types = types.concat(schema);
    }


    let typesArray = super.getSchema(types);

    return typesArray;

  }



  getApiSchema(types = []) {

    let baseSchema = [];

    let schemaFile = __dirname + "/../../schema/generated/prisma.graphql";

    if (fs.existsSync(schemaFile)) {
      baseSchema = fs.readFileSync(schemaFile, "utf-8");

      baseSchema = this.cleanupApiSchema(baseSchema, [

        "ResourceCreateInput",
        "ResourceUpdateInput",

        "ChatRoomCreateInput",
        "ChatRoomUpdateInput",
        "UserCreateManyWithoutRoomsInput",
        "UserUpdateManyWithoutRoomsInput",
        // "ChatRoomInvitationUpdateManyWithoutRoomInput",

        "ChatMessageCreateInput",
        "ChatMessageUpdateInput",
        "ChatRoomCreateOneWithoutMessagesInput",

        "ChatMessageReadedCreateInput",
        "ChatMessageCreateOneWithoutReadedByInput",

        "EthContractSourceCreateInput",
        "EthContractSourceUpdateInput",
        "EthTransactionCreateInput",
        "EthTransactionSubscriptionPayload",
      ]);

    }
    else {
      console.error(chalk.red(`Schema file ${schemaFile} did not loaded`));
    }


    let apiSchema = super.getApiSchema(types.concat(baseSchema), [

      "UserCreateInput",
      "UserUpdateInput",
      "NotificationTypeUpdateManyWithoutUsersInput",
      "UserCreateOneWithoutResourcesInput",

    ]);


    let schema = fileLoader(__dirname + '/schema/api/', {
      recursive: true,
    });

    apiSchema = mergeTypes(schema.concat(apiSchema), { all: true });

    // console.log(chalk.green("Modxclub apiSchema"), apiSchema);


    /**
     * Фильтруем все резолверы, коих нет в текущем классе
     */
    const resolvers = this.getResolvers();

    const parsed = parse(apiSchema);

    let operations = parsed.definitions.filter(
      n => n.kind === "ObjectTypeDefinition"
        && ["Query", "Mutation", "Subscription"].indexOf(n.name.value) !== -1
      // && !resolvers[n.name.value][]
    );

    operations.map(n => {

      let {
        name: {
          value: operationName,
        },
        fields,
      } = n;

      n.fields = fields.filter(field => {
        // console.log(chalk.green("field"), field);
        return resolvers[operationName][field.name.value] ? true : false;
      });

    });

    apiSchema = print(parsed);


    return apiSchema;

  }



  getResolvers() {


    let resolvers = super.getResolvers();

    // console.log("resolvers", resolvers);

    const {
      Query: {
        letter,
        letters,
        lettersConnection,
        file,
        files,
        filesConnection,
        logedin,
        logedins,
        logedinsConnection,
        log,
        logs,
        logsConnection,

        ...Query
      },
      Mutation,
      ...other
    } = resolvers;


    const {
    } = Mutation;


    let AllowedMutations = {
      ...Mutation,
    };

    return {
      ...other,
      Query,
      Mutation: AllowedMutations,
      Log: {
        stack: () => null,
      },
      Letter: {
        id: () => null,
        email: () => null,
        subject: () => null,
        message: () => null,
      },
    };

  }


}


export default CoreModule;