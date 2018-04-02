import requiresAuth from "../permissions";

const NEW_CHANNEL_MESSAGE = "NEW_CHANNEL_MESSAGE";

export default {
  DirectMessage: {
    sender: ({ sender, senderId }, args, { models }) => {
      if (sender) {
        return sender;
      }
      return models.User.findOne({ where: { id: senderId } });
    }
  },
  Query: {
    directMessages: requiresAuth.createResolver(
      async (parent, { teamId, userId }, { models, user }, info) => {
        const messages = await models.DirectMessage.findAll(
          {
            order: [["created_at", "ASC"]]
          },
          {
            where: {
              teamId,
              [models.sequelize.Op.or]: [
                {
                  [models.sequelize.Op.and]: [
                    { receiverId: userId },
                    {
                      senderId: user.id
                    }
                  ],
                  [models.sequelize.Op.and]: [
                    { receiverId: user.id },
                    {
                      senderId: userId
                    }
                  ]
                }
              ]
            }
          },
          {
            raw: true
          }
        );
        return messages;
      }
    )
  },
  Mutation: {
    createDirectMessage: requiresAuth.createResolver(
      async (parent, args, { models, user }, info) => {
        try {
          const directMessage = await models.DirectMessage.create({
            ...args,
            senderId: user.id
          });
          //   const asyncFunc = async () => {
          //     const currentUser = await models.User.findOne({
          //       where: {
          //         id: user.id
          //       }
          //     });

          //     pubsub.publish(NEW_CHANNEL_MESSAGE, {
          //       channelId: args.channelId,
          //       newChannelMessage: {
          //         ...message.dataValues,
          //         user: currentUser.dataValues
          //       }
          //     });
          //   };

          //   asyncFunc();

          return true;
        } catch (error) {
          console.log(error);
          return false;
        }
      }
    )
  }
};