import formatErrors from "../formatErrors";

export default {
  Mutation: {
    createChannel: async (parent, args, context, info) => {
      const { models } = context;
      try {
        const channel = models.Channel.create({ ...args });

        return {
          ok: true,
          channel
        };
      } catch (error) {
        return {
          ok: false,
          errors: formatErrors(error)
        };
      }
    }
  }
};
