

const jwt = require('jsonwebtoken')

const { Prisma } = require('prisma-binding')

class Context {

  constructor(params = {}) {

    const {
      APP_SECRET,
      ...other
    } = params;

    const db = new Prisma({
      typeDefs: 'src/schema/generated/prisma.graphql',
      ...other,
    });



    const context = async options => {

      const {
        request,
        response,
      } = options || {};

      let currentUser;

      const Authorization = request && request.get('Authorization');

      if (Authorization) {
        try {
          const token = Authorization.replace('Bearer ', '')
          const { userId } = jwt.verify(token, APP_SECRET)

          if (userId) {
            currentUser = await db.query.user({
              where: {
                id: userId,
              },
            });
          }
        }
        catch (error) {
          console.error(error);
        }
      }

      return {
        ...options,
        db,
        currentUser,
        ...params,
      };

    };

    return context;

  }

}

export default Context;