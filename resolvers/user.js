import { tryLogin } from "../auth";
import formatErrors from "../formatErrors";
import requiresAuth from "../permissions";

export default {
  User: {
    teams: (parent, args, { models, user }, info) =>
      models.sequelize.query(
        "select * from teams as team join members as member on team.id = member.team_id where member.user_id = ?",
        {
          replacements: [user.id],
          model: models.Team,
          raw: true
        }
      )
  },
  Query: {
    me: requiresAuth.createResolver((parent, args, context) => {
      const { models, user } = context;
      return models.User.findOne({ where: { id: user.id } });
    }),
    allUsers: (parent, args, context) => {
      const { models } = context;
      return models.User.findAll();
    },
    inviteTeams: requiresAuth.createResolver(
      async (parent, args, { models, user }) =>
        models.Team.findAll(
          {
            include: [
              {
                model: models.User,
                where: { id: user.id }
              }
            ]
          },
          { raw: true }
        )
    )
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
