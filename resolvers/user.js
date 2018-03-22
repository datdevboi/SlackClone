import bcrypt from "bcrypt";
import _ from "lodash";
import { tryLogin } from "../auth";

const formatErrors = (e, models) => {
  if (e instanceof models.sequelize.ValidationError) {
    //  _.pick({a: 1, b: 2}, 'a') => {a: 1}
    return e.errors.map(x => _.pick(x, ["path", "message"]));
  }
  return [{ path: "name", message: "something went wrong" }];
};

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
