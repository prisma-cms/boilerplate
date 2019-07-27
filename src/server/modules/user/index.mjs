

import PrismaModule from "@prisma-cms/prisma-module";

import UserModule, {
  UserPayload,
} from "@prisma-cms/user-module";

import MergeSchema from 'merge-graphql-schemas';

import path from 'path';
import chalk from "chalk";

const moduleURL = new URL(import.meta.url);

const __dirname = path.dirname(moduleURL.pathname);

const { fileLoader, mergeTypes } = MergeSchema;


export class ModxclubUserProcessor extends UserPayload {


  async signup(args, info) {

    let {
      data: {
        username,
        email,
        password,
      },
    } = args;


    if (!username) {
      this.addFieldError("username", "Не указан логин");
    }

    if (!email) {
      this.addFieldError("email", "Не указан емейл");
    }

    if (!password) {
      this.addFieldError("password", "Не указан пароль");
    }


    return super.signup(args, info);
  }


  /**
   * Авторизация/регистрация с помощью метамаска.
   * 
   */
  async ethSigninOrSignup(args, info) {

    // console.log("ethSigninOrSignup args", args);


    const {
      db,
      resolvers: {
        Mutation: {
          ethRecoverPersonalSignature,
        },
      },
    } = this.ctx;

    let result;

    /**
     * Получаем адрес кошелька которым было подписано сообщение.
     * Заметка: нам не важно какое было сообщение. Важно кем было подписано сообщение.
     */
    const address = await ethRecoverPersonalSignature(null, args, this.ctx);

    if (!address) {

      return this.addError("Не был получен адрес подписчика");
    }

    // console.log("ethSigninOrSignup address", address);

    /**
     * Пытаемся получить аккаунт, если уже имеется
     */

    let EthAccountAuthed;


    const ethAccount = await db.query.ethAccount({
      where: {
        address,
      },
    }, `{
      id
      address
      CreatedBy{
        id
      }
      UserAuthed{
        id
      }
    }`);


    if (ethAccount) {

      const {
        UserAuthed,
      } = ethAccount;


      /**
       * Если уже имеется привязанный пользователь, авторизовываем его
       */

      if (UserAuthed) {

        this.data = UserAuthed;

        const token = this.createToken(UserAuthed);

        result = {
          ...this.prepareResponse(),
          token,
        };

      }


      EthAccountAuthed = {
        connect: {
          address,
        },
      }

    }
    else {

      EthAccountAuthed = {
        create: {
          address,
        },
      }
    }

    // console.log("ethSigninOrSignup ethAccount", JSON.stringify(ethAccount, true, 2));

    // return {}

    /**
     * Пытаемся получить пользователя по адресу.
     * Если был получен, то авторизовываем. 
     * Если нет, то создаем нового.
     */


    const generatedPassword = await this.generatePassword();

    // console.log("ethSigninOrSignup generatedPassword", generatedPassword);


    /**
     * result возможен только если с аккаунтом был получен ранее авторизованный пользователь.
     * Иначе создаем нового пользователя.
     */
    if (!result && EthAccountAuthed) {

      result = await super.signup({
        data: {
          password: await this.createPassword(generatedPassword),
          EthAccountAuthed,
        },
      });

      // console.log("ethSigninOrSignup result", JSON.stringify(result, true, 2));

    }


    const {
      success,
      data,
    } = result || {};



    if (success && data) {

      const {
        id: userId,
      } = data;


      /**
       * Если у аккаунт еще не указано кем он создан, привязываем его к текущему пользователю
       */

      // const ethAccount = await db.query.ethAccount({
      //   where: {
      //     address,
      //   },
      // }, `{
      //   id
      //   address
      //   CreatedBy{
      //     id
      //   }
      // }`);

      // if (ethAccount && !ethAccount.CreatedBy) {

      //   await db.mutation.updateEthAccount({
      //     where: {
      //       address,
      //     },
      //     data: {
      //       CreatedBy: {
      //         connect: {
      //           id: userId,
      //         },
      //       },
      //     },
      //   })
      //     .catch(console.error);

      // }


      /**
       * Если аккаунт новый, привязываем к текущему пользователю
       */
      if (EthAccountAuthed && EthAccountAuthed.create) {

        await db.mutation.updateEthAccount({
          where: {
            address,
          },
          data: {
            CreatedBy: {
              connect: {
                id: userId,
              },
            },
          },
        })
          .catch(console.error);

      }


      await db.mutation.updateUser({
        data: {
          LogedIns: {
            create: {},
          },
          activated: true,
        },
        where: {
          id: userId,
        },
      })
        .catch(console.error);

    }


    return result || this.prepareResponse();

  }


  /**
   * Ключница. Присоединяем к пользователю ethereum-аккаунт для авторизации
   * 
   */
  async ethConnectAuthAccount(args, info) {

    // console.log("ethSigninOrSignup args", args);


    const {
      db,
      resolvers: {
        Mutation: {
          ethRecoverPersonalSignature,
          createEthAccountProcessor,
        },
      },
      currentUser,
    } = this.ctx;

    let result;

    const {
      id: currentUserId,
    } = currentUser || {};

    if (!currentUserId) {
      throw new Error("Необходимо авторизоваться");
    }

    /**
     * Получаем адрес кошелька которым было подписано сообщение.
     * Заметка: нам не важно какое было сообщение. Важно кем было подписано сообщение.
     */
    const address = await ethRecoverPersonalSignature(null, args, this.ctx);

    if (!address) {

      return this.addError("Не был получен адрес подписчика");
    }

    // console.log("ethSigninOrSignup address", address);

    /**
     * Пытаемся получить аккаунт, если уже имеется
     */

    // let EthAccountAuthed;


    const ethAccount = await db.query.ethAccount({
      where: {
        address,
      },
    }, `{
      id
      address
      CreatedBy{
        id
      }
      UserAuthed{
        id
      }
    }`);


    if (ethAccount) {

      const {
        UserAuthed,
      } = ethAccount;


      /**
       * Если уже имеется привязанный пользователь, проверяем, принадлежит ли он текущему пользователю
       */

      if (UserAuthed) {

        const {
          id,
        } = UserAuthed;


        if (id === currentUserId) {

          this.data = ethAccount;
          result = this.prepareResponse();
        }
        else {
          
          this.addError("Аккаунт уже используется другим пользователем");
        }

      }
      else {

        /**
         * Если аккаунт есть, но еще не привязан ни к какому пользователю, привязываем его к текущему пользователю
         */
        this.data = await db.mutation.updateEthAccount({
          where: {
            address,
          },
          data: {
            UserAuthed: {
              connect: {
                id: currentUserId,
              },
            },
          },
        });

        result = this.prepareResponse();

      }


      // EthAccountAuthed = {
      //   connect: {
      //     address,
      //   },
      // }

    }
    else {

      // EthAccountAuthed = {
      //   create: {
      //     address,
      //   },
      // }

      result = await createEthAccountProcessor(null, {
        data: {
          address,
          UserAuthed: {
            connect: {
              id: currentUserId,
            },
          },
        },
      }, this.ctx);

    }

    // console.log("ethConnectAuthAccount ethAccount", JSON.stringify(ethAccount, true, 2));

    return result || this.prepareResponse();

    /**
     * Пытаемся получить пользователя по адресу.
     * Если был получен, то авторизовываем. 
     * Если нет, то создаем нового.
     */


    const generatedPassword = await this.generatePassword();

    // console.log("ethSigninOrSignup generatedPassword", generatedPassword);


    /**
     * result возможен только если с аккаунтом был получен ранее авторизованный пользователь.
     * Иначе создаем нового пользователя.
     */
    if (!result && EthAccountAuthed) {

      result = await super.signup({
        data: {
          password: await this.createPassword(generatedPassword),
          EthAccountAuthed,
        },
      });

      // console.log("ethSigninOrSignup result", JSON.stringify(result, true, 2));

    }


    const {
      success,
      data,
    } = result || {};



    if (success && data) {

      const {
        id: userId,
      } = data;


      /**
       * Если у аккаунт еще не указано кем он создан, привязываем его к текущему пользователю
       */

      // const ethAccount = await db.query.ethAccount({
      //   where: {
      //     address,
      //   },
      // }, `{
      //   id
      //   address
      //   CreatedBy{
      //     id
      //   }
      // }`);

      // if (ethAccount && !ethAccount.CreatedBy) {

      //   await db.mutation.updateEthAccount({
      //     where: {
      //       address,
      //     },
      //     data: {
      //       CreatedBy: {
      //         connect: {
      //           id: userId,
      //         },
      //       },
      //     },
      //   })
      //     .catch(console.error);

      // }


      /**
       * Если аккаунт новый, привязываем к текущему пользователю
       */
      if (EthAccountAuthed && EthAccountAuthed.create) {

        await db.mutation.updateEthAccount({
          where: {
            address,
          },
          data: {
            CreatedBy: {
              connect: {
                id: userId,
              },
            },
          },
        })
          .catch(console.error);

      }


      await db.mutation.updateUser({
        data: {
          LogedIns: {
            create: {},
          },
          activated: true,
        },
        where: {
          id: userId,
        },
      })
        .catch(console.error);

    }


    return result || this.prepareResponse();

  }


  async mutate(method, args, info) {

    let {
      data: {
        ethWalletPK: privateKey,
        ethWalletPKSendEmail,
        ...data
      },
      where,
      ...otherArgs
    } = args;


    const {
      db,
      web3,
    } = this.ctx;


    if (privateKey && where) {


      let account;

      if (!/^0x/.test(privateKey)) {
        return this.addFieldError("ethWalletPK", "Приватный ключ должен начинаться с 0x");
      }

      try {
        account = web3.eth.accounts.privateKeyToAccount(privateKey);
      }
      catch (error) {
        console.error(chalk.red("privateKeyToAccount Error"), error);
      }


      // console.log("account", account);

      if (!account) {
        return this.addFieldError("ethWalletPK", "Приватный ключ не был дешифрован");
      }

      const {
        address: ethWallet,
      } = account;

      const user = await db.query.user({
        where,
      }, `{
        id
        email,
        EthAccounts(
          where: {
            type: Contract
          }
        ){
          id
          address
        },
      }`);

      if (!user) {
        return this.addError("Не был получен пользователь");
      }

      const {
        EthAccounts,
        email,
      } = user;

      /**
       * Если есть аккаунт, обновляем его.
       * Если нету, создаем новый
       */

      // if (EthAccounts && EthAccounts[0]) {

      //   // const {
      //   //   id,
      //   // } = EthAccounts[0];

      //   // Object.assign(data, {
      //   //   EthAccounts: {
      //   //     update: {
      //   //       where: {
      //   //         id,
      //   //       },
      //   //       data: {
      //   //         address: ethWallet,
      //   //       },
      //   //     },
      //   //   },
      //   // });

      //   return this.addError("Нельзя менять кошелек");

      // }
      // else {



      /**
       * Если пользователь указал отправить ему уведомление с паролем, отправляем
       */

      let LettersCreated;

      if (ethWalletPKSendEmail && email) {

        LettersCreated = {
          create: {
            rank: 100,
            email,
            subject: "Данные вашего кошелька",
            message: `
                <h3>
                  Данные вашего кошелька
                </h3>

                <p>
                  <strong>Адрес:</strong> ${ethWallet}
                </p>

                <p>
                  <strong>Приватный ключ:</strong> ${privateKey}
                </p>
              `,
          },
        }

      }

      // const chainId = await web3.eth.net.getId();

      Object.assign(data, {
        EthAccounts: {
          create: {
            address: ethWallet,
            type: "Contract",
            // chainId,
          },
        },
        LettersCreated,
      });

    }

    // }


    args = {
      ...otherArgs,
      where,
      data,
    }

    return super.mutate(method, args, info);
  }

}


class ModxclubUserModule extends UserModule {


  // constructor() {

  //   super();

  //   this.mergeModules([
  //     SocialModule,
  //   ]);

  // }

  // getApiSchema(types = []) {


  //   let apiSchema = super.getApiSchema(types, [
  //     "Mutation",

  //     "UserCreateInput",

  //     "ResourceCreateInput",
  //     "ResourceUpdateInput",
  //   ]);


  //   let schema = fileLoader(__dirname + '/schema/api/', {
  //     recursive: true,
  //   });

  //   apiSchema = mergeTypes([apiSchema.concat(schema)], { all: true });

  //   return apiSchema;

  // }

  async injectProjectLink(result, ctx) {


    const {
      success,
      data: user,
    } = result || {};

    if (success && user) {

      const {
        id: userId,
      } = user;


      if (!userId) {
        return;
      }

      const {
        getProjectFromRequest,
        db,
      } = ctx;

      const project = await getProjectFromRequest(ctx);

      // console.log("ctx project", project);

      if (project) {

        const {
          id: projectId,
        } = project;

        await db.mutation.updateProject({
          where: {
            id: projectId,
          },
          data: {
            PrismaUsers: {
              connect: {
                id: userId,
              },
            },
          },
        });

      }

    }

    return;
  }


  injectWhere(where) {

    let {
      search,
      ...other
    } = where || {};


    let condition;


    if (search !== undefined) {

      delete where.search;


      if (search) {

        condition = {
          OR: [
            {
              id: search,
            },
            {
              fullname_contains: search,
            },
            {
              username_contains: search,
            },
            {
              email_contains: search,
            },
          ],
        }

      }

    }


    if (condition) {

      /**
       * Если объект условия пустой, то во избежание лишней вложенности
       * присваиваем ему полученное условие
       */
      if (!Object.keys(where).length) {

        Object.assign(where, condition);

      }

      /**
       * Иначе нам надо добавить полученное условие в массив AND,
       * чтобы объединить с другими условиями
       */
      else {

        if (!where.AND) {

          where.AND = [];

        }

        where.AND.push(condition);

      }

    }

    return where;

  }


  addQueryConditions(args, ctx, info) {

    const {
      modifyArgs,
    } = ctx;

    const {
      where,
    } = args;

    modifyArgs(where, this.injectWhere, info);

  }


  getResolvers() {


    let resolvers = super.getResolvers();

    const {
      Query: {
        users,
        usersConnection,
        ...Query
      },
      Mutation: {
        signup,
        updateUserProcessor,
        ...Mutation
      },
      ...other
    } = resolvers;



    return {
      ...other,
      Query: {
        ...Query,
        users: (source, args, ctx, info) => {

          this.addQueryConditions(args, ctx, info);

          return users(source, args, ctx, info);
        },
        usersConnection: (source, args, ctx, info) => {

          this.addQueryConditions(args, ctx, info);

          return usersConnection(source, args, ctx, info);
        },
      },
      Mutation: {
        ...Mutation,
        signup: async (source, args, ctx, info) => {

          const result = await new ModxclubUserProcessor(ctx).signup(args, info);

          await this.injectProjectLink(result, ctx);

          return result;
        },
        signin: async (source, args, ctx, info) => {

          // args = await this.injectProjectLink(args, ctx);

          const result = await new ModxclubUserProcessor(ctx).signin(args, info);

          // console.log("signin result", result);

          await this.injectProjectLink(result, ctx);

          return result;
        },
        ethSigninOrSignup: async (source, args, ctx, info) => {

          // args = await this.injectProjectLink(args, ctx);

          const result = await new ModxclubUserProcessor(ctx).ethSigninOrSignup(args, info);

          // console.log("signin result", result);

          await this.injectProjectLink(result, ctx);

          return result;
        },

        /**
         * Return EthAccount
         */
        ethConnectAuthAccount: async (source, args, ctx, info) => {

          // args = await this.injectProjectLink(args, ctx);

          const result = await new ModxclubUserProcessor(ctx).ethConnectAuthAccount(args, info);

          return result;
        },
        updateUserProcessor: (source, args, ctx, info) => {

          // console.log("updateUserProcessor args", args);

          return new ModxclubUserProcessor(ctx).updateWithResponse("User", args, info);
        },
      },
      Subscription: {
        user: {
          subscribe: async (parent, args, ctx, info) => {

            return ctx.db.subscription.user({}, info);
          },
        },
      },
    };

  }


}


export default ModxclubUserModule;