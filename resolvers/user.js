import { tryLogin } from "../auth";
import formatErrors from "../formatErrors";

export default {
  Query: {
    getUser: (parent, args, context) => {
      const { models } = context;
      return models.User.findOne({ where: { id: args.id } });
    },
    allUsers: (parent, args, context) => {
      const { models } = context;
      return models.User.findAll();
    }
  },
  Mutation: {
    login: (parent, args, context) => {
      const { email, password } = args;
      return tryLogin(
        email,
        password,
        context.models,
        context.SECRET,
        context.SECRET2
      );
    },
    register: async (parent, args, context) => {
      const { models } = context;
      try {
        const user = await models.User.create(args);

        return {
          ok: true,
          user
        };
      } catch (error) {
        return {
          ok: false,
          errors: formatErrors(error, models)
        };
      }
    }
  }
};
