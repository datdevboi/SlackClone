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

          const response = await models.sequelize.transaction(
            async transaction => {
              const channel = await models.Channel.create(args, {
                transaction
              });
              console.log(channel);
              if (!args.public) {
                const members = args.members.filter(m => m !== user.id);
                members.push(user.id);
                await models.PCMember.bulkCreate(
                  members.map(m => ({
                    userId: m,
                    channelId: channel.dataValues.id
                  })),
                  { transaction }
                );
              }

              return channel;
            }
          );

          return {
            ok: true,
            channel: response
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
