
import fs from "fs";

import chalk from "chalk";


import MergeSchema from 'merge-graphql-schemas';

import PrismaModule from "@prisma-cms/prisma-module";


import LogModule from "@prisma-cms/log-module";
// import UserModule from "@prisma-cms/user-module";
import UserModule from "./user";
import ResourceModule from "./resource";
import MailModule from "@prisma-cms/mail-module";
import UploadModule from "@prisma-cms/upload-module";
import RouterModule from "@prisma-cms/router-module";
import SocietyModule, {
  Modules as SocietyModules,
} from "@prisma-cms/society-module";
import EthereumModule, {
  Modules as EthereumModules,
} from "@prisma-cms/ethereum-module";
import WebrtcModule from "@prisma-cms/webrtc-module";
import MarketplaceModule from "@prisma-cms/marketplace-module";
// import CooperationModule from "@prisma-cms/cooperation-module";
import CooperationModule from "./cooperation";

import Gallery from "./Gallery";
import GalleryFile from "./GalleryFile";

import { parse, print } from "graphql";
import path from 'path';

const moduleURL = new URL(import.meta.url);

const __dirname = path.dirname(moduleURL.pathname);

const { fileLoader, mergeTypes } = MergeSchema;


class CoreModule extends PrismaModule {


  constructor(options = {}) {

    super(options);

    this.mergeModules([
      CooperationModule,
      LogModule,
      MailModule,
      UploadModule,
      SocietyModule,
      EthereumModule,
      WebrtcModule,
      // UserModule,
      RouterModule,
      MarketplaceModule,
      ResourceModule,
      Gallery,
      GalleryFile,
    ]
      .concat(
        EthereumModules,
        SocietyModules,
      )
      .concat([
        UserModule,
      ])
    );

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
        // Cooperation
        "ProjectCreateInput",
        "ProjectUpdateInput",
        "TaskCreateInput",
        // "TaskUpdateInput",
        "TimerCreateInput",
        "TimerUpdateInput",

        "TaskReactionCreateInput",
        // "TaskReactionUpdateInput",
        "TaskCreateOneInput",
        "TaskUpdateOneInput",

        "ProjectMemberCreateInput",
        "ProjectMemberUpdateInput",
        "ProjectCreateOneWithoutMembersInput",
        "UserCreateOneWithoutProjectsInput",
        "ServiceCreateManyWithoutProjectsInput",
        "ServiceUpdateManyWithoutProjectsInput",

        "TeamCreateInput",
        "TeamUpdateInput",
        "TeamCreateOneWithoutChildsInput",
        "TeamCreateManyWithoutParentInput",
        "TeamMemberCreateManyWithoutTeamInput",
        "ProjectCreateManyWithoutTeamInput",
        "TeamUpdateOneWithoutChildsInput",
        "TeamUpdateManyWithoutParentInput",
        "TeamMemberUpdateManyWithoutTeamInput",
        "ProjectUpdateManyWithoutTeamInput",

        "TeamMemberCreateInput",
        "TeamMemberUpdateInput",
        "TeamCreateOneWithoutMembersInput",
        "UserCreateOneWithoutTeamsInput",

        "PositionCreateInput",
        "PositionUpdateInput",
        "UserCreateManyWithoutPositionsInput",
        "UserUpdateManyWithoutPositionsInput",

        "ServiceCreateInput",
        // Eof Cooperation

        "ResourceCreateInput",
        "ResourceUpdateInput",
        "ResourceCreateOneWithoutChildsInput",
        "ResourceCreateManyWithoutParentInput",
        "UserUpdateOneWithoutResourcesInput",
        "ResourceUpdateOneWithoutChildsInput",
        "ResourceUpdateManyWithoutParentInput",
        "ResourceUpdateManyWithoutCreatedByInput",
        "ResourceCreateManyWithoutCreatedByInput",
        "FileCreateOneWithoutImageResourceInput",
        "FileUpdateOneWithoutImageResourceInput",

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

        // "CallRequestCreateInput",
        "CallRequestUpdateDataInput",
        "ChatRoomCreateOneWithoutCallRequestsInput",
        "ChatRoomUpdateOneWithoutCallRequestsInput",

        "EthContractSourceCreateInput",
        "EthContractSourceUpdateInput",
        "EthTransactionCreateInput",
        "EthAccountCreateInput",
        "EthAccountUpdateInput",
        "EthTransactionSubscriptionPayload",
      ]);

    }
    else {
      console.error(chalk.red(`Schema file ${schemaFile} did not loaded`));
    }


    let apiSchema = super.getApiSchema(types.concat(baseSchema), [

      "UserCreateInput",
      "UserUpdateInput",

    ]);


    let schema = fileLoader(__dirname + '/schema/api/', {
      recursive: true,
    });

    apiSchema = mergeTypes(schema.concat(apiSchema), { all: true });

    // console.log(chalk.green("apiSchema"), apiSchema);


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

      return null;
    });

    apiSchema = print(parsed);


    return apiSchema;

  }


  renderApiSchema() {

    let schemaFile = "src/schema/generated/api.graphql";

    let baseSchema = "";

    if (fs.existsSync(schemaFile)) {
      baseSchema = fs.readFileSync(schemaFile, "utf-8");
    }
    // else {
    //   console.log("file not exists");
    // }

    return baseSchema;
  }


  getResolvers() {


    let resolvers = super.getResolvers();

    // console.log("resolvers", resolvers);

    const {
      Query: {
        letter,
        letters,
        lettersConnection,
        // file,
        files,
        filesConnection,
        logedin,
        logedins,
        logedinsConnection,
        log,
        logs,
        logsConnection,

        resource,

        ...Query
      },
      Mutation,
      ...other
    } = resolvers;


    // const {
    // } = Mutation;


    let AllowedMutations = {
      ...Mutation,
    };

    return {
      ...other,
      Query: {
        ...Query,
        apiSchema: this.renderApiSchema,
        resource: async (source, args, ctx, info) => {

          const {
            where,
          } = args;

          let {
            uri,
          } = where || {};

          /**
           * Если указан ури, но не начинается со слеша, то добавляем слеш
           */
          if (uri && !uri.startsWith("/")) {
            where.uri = `/${uri}`;

            Object.assign(args, where);
          }

          return resource(source, args, ctx, info);
        },
      },
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