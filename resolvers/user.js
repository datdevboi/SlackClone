import bcrypt from "bcrypt";

export default {
  Query: {
    getUser: (parent, args, context, info) => {
      const { models } = context;
      return models.User.findOne({ where: { id: args.id } });
    },
    allUsers: (parent, args, context, info) => {
      const { models } = context;
      return models.User.findAll();
    }
  },
  Mutation: {
    register: async (parent, args, context, info) => {
      const { models } = context;
      try {
        const hashedPassword = await bcrypt.hash(args.password, 12);
        await models.User.create({ ...args, password: hashedPassword });
        return true;
      } catch (error) {
        return false;
      }
    }
  }
};
