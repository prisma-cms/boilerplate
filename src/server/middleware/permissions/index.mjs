
import GraphQLShield from 'graphql-shield';

const {
  rule,
  // and,
  // or,
  shield,
} = GraphQLShield;

const rules = {
  isSudo: rule({ cache: 'no_cache' })((source, args, ctx) => {

    const {
      currentUser,
    } = ctx;

    const {
      sudo,
    } = currentUser || {};

    return sudo === true;
  }),
};

export default shield(
  {
    // Query: {
    //   users: rules.isSudo,
    // },
    // Mutation: {
    //   updateUserProcessor: rules.isSudo,
    // },
  },
  {
    fallbackError: (error, parent, args, context, info) => {

      return error || new Error("Доступ запрещен");
    },
  }
);

