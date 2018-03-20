export default {
  Mutation: {
    createTeam: async (parent, args, context, info) => {
      const { models, user } = context;

      try {
        await models.Team.create({ ...args, owner: user.id });
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  }
};
