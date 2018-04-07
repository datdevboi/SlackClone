import formatErrors from "../formatErrors";
import requiresAuth from "../permissions";

export default {
  Mutation: {
    getOrCreateChannel: requiresAuth.createResolver(
      async (parent, { teamId, members }, { models, user }, info) => {
        members.push(user.id);
        // check if dm channel already exist with these members
        const [data, result] = await models.sequelize.query(
          `select c.id 
        from channels as c, pcmembers pc 
        where pc.channel_id = c.id and c.dm = true and c.public = false and c.team_id = ${teamId}
        group by c.id 
        having array_agg(pc.user_id) @> Array[${members.join(
          ","
        )}] and count(pc.user_id) = ${members.length};`,
          {
            raw: true
          }
        );

        if (data.length) {
          return data[0].id;
        }

        const newChannelId = await models.sequelize.transaction(
          async transaction => {
            const channel = await models.Channel.create(
              {
                name: "Hello",
                public: false,
                dm: true,
                teamId
              },
              {
                transaction
              }
            );

            const pcmembers = members.map(m => ({
              userId: m,
              channelId: channel.dataValues.id
            }));

            await models.PCMember.bulkCreate(pcmembers, { transaction });

            return channel.dataValues.id;
          }
        );

        return newChannelId;
      }
    ),
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
