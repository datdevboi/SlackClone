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
    addTeamMember: requiresAuth.createResolver(
      async (parent, { email, teamId }, context) => {
        const { models, user } = context;
        try {
          const teamPromise = models.Team.findOne(
            {
              where: {
                id: teamId
              }
            },
            {
              raw: true
            }
          );

          const userToAddPromise = models.User.findOne(
            {
              where: {
                email
              }
            },
            { raw: true }
          );

          const [team, userToAdd] = await Promise.all([
            teamPromise,
            userToAddPromise
          ]);

          if (team.owner !== user.id) {
            return {
              ok: false,
              errors: [
                { path: "email", message: "You cannot add members to the team" }
              ]
            };
          }

          if (!userToAdd) {
            return {
              ok: false,
              errors: [
                {
                  path: "email",
                  message: "Could not find user with this email"
                }
              ]
            };
          }

          await models.Member.create({
            userId: userToAdd,
            teamId
          });

          return {
            ok: true
          };
        } catch (err) {
          return {
            ok: false,
            errors: formatErrors(err)
          };
        }
      }
    ),
    createTeam: requiresAuth.createResolver(async (parent, args, context) => {
      const { models, user } = context;

      try {
        const team = await models.Team.create({ ...args, owner: user.id });
        const channel = await models.Channel.create({
          name: "general",
          public: true,
          teamId: team.id
        });
        console.log(channel);
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
