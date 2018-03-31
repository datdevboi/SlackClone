import formatErrors from "../formatErrors";
import requiresAuth from "../permissions";

export default {
  Mutation: {
    createChannel: requiresAuth.createResolver(
      async (parent, args, context, info) => {
        const { models, user } = context;
        try {
          const member = await models.Member.findOne(
            { where: { userId: user.id, teamId: args.teamId } },
            { raw: true }
          );

          if (!member.admin) {
            return {
              ok: false,
              errors: [
                {
                  path: "name",
                  message:
                    "You have to be the admin to the team to create channels"
                }
              ]
            };
          }
          const channel = models.Channel.create(args);

          return {
            ok: true,
            channel
          };
        } catch (error) {
          return {
            ok: false,
            errors: formatErrors(error, models)
          };
        }
      }
    )
  }
};
