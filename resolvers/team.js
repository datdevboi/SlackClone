import formatErrors from "../formatErrors";

export default {
  Mutation: {
    createTeam: async (parent, args, context) => {
      const { models, user } = context;

      try {
        await models.Team.create({ ...args, owner: user.id });
        return {
          ok: true
        };
      } catch (error) {
        console.log(error);
        return {
          ok: false,
          errors: formatErrors(error, models)
        };
      }
    }
  }
};
