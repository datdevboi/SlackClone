import requiresAuth from "../permissions";
import { PubSub, withFilter } from "graphql-subscriptions";

const pubsub = new PubSub();

const NEW_CHANNEL_MESSAGE = "NEW_CHANNEL_MESSAGE";

export default {
  Subscription: {
    newChannelMessage: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(NEW_CHANNEL_MESSAGE),
        (payload, args) => payload.channelId === args.channelId
      )
    }
  },
  Message: {
    user: ({ userId }, args, { models }) =>
      models.User.findOne({ where: { id: userId } })
  },
  Query: {
    messages: requiresAuth.createResolver(
      async (parent, { channelId }, { models, user }, info) => {
        const messages = await models.Message.findAll(
          {
            order: [["created_at", "ASC"]]
          },
          {
            where: { channelId }
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
    createMessage: requiresAuth.createResolver(
      async (parent, args, context, info) => {
        const { models, user } = context;
        try {
          const message = await models.Message.create({
            ...args,
            userId: user.id
          });
          pubsub.publish(NEW_CHANNEL_MESSAGE, {
            channelId: args.channelId,
            newChannelMessage: message.dataValues
          });

          return true;
        } catch (error) {
          console.log(error);
          return false;
        }
      }
    )
  }
};
