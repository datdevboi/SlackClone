import formatErrors from "../formatErrors";
import requiresAuth from "../permissions";

export default {
  Query: {
    allTeams: requiresAuth.createResolver(
      async (parent, args, { models, user }) =>
        models.Team.findAll({ where: { owner: user.id } }, { raw: true })
    )
  },
  Mutation: {
    createTeam: requiresAuth.createResolver(async (parent, args, context) => {
      const { models, user } = context;

      try {
        const team = models.Team.create({ ...args, owner: user.id });
        await models.Channel.create({
          name: "general",
          public: true,
          teamId: team.id
        });
        return {
          ok: true,
          team
        };
      } catch (error) {
        console.log(error);
        return {
          ok: false,
          errors: formatErrors(error, models)
        };
      }
    })
  },
  Team: {
    channels: ({ id }, args, { models }) =>
      models.Channel.findAll({ where: { teamId: id } })
  }
};
