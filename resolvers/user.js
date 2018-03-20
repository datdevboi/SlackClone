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
    createUser: (parent, args, context, info) => {
      const { models } = context;
      return models.User.create(args);
    }
  }
};
