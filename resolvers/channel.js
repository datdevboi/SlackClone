export default {
  Mutation: {
    createChannel: async (parent, args, context, info) => {
      const { models } = context;
      try {
        await models.Channel.create({ ...args });
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  }
};
