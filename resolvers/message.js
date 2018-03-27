export default {
  Query: {
    messages: async (parent, args, { models, user }, info) => []
  },
  Mutation: {
    createMessage: async (parent, args, context, info) => {
      const { models, user } = context;
      try {
        await models.Message.create({ ...args, userId: user.id });
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  }
};
