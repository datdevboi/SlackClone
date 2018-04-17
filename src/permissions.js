const createResolver = resolver => {
  const baseResolver = resolver;
  baseResolver.createResolver = childResolver => {
    const newResolver = async (parent, args, context, info) => {
      await resolver(parent, args, context, info);
      return childResolver(parent, args, context, info);
    };
    return createResolver(newResolver);
  };
  return baseResolver;
};

const requiresAuth = createResolver((parent, args, context) => {
  if (!context.user || !context.user.id) {
    throw new Error("Not authenticated");
  }
});

export default requiresAuth;

export const requiresTeamAccess = createResolver(
  async (parent, { channelId }, { user, models }) => {
    if (!user || !user.id) {
      throw new Error("Not authenticated");
    }
    const channel = await models.Channel.findOne({
      where: { id: channelId }
    });
    const member = await models.Member.findOne({
      where: {
        teamId: channel.teamId,
        userId: user.id
      }
    });
    if (!member) {
      throw new Error(
        "You have to be a member of the team to subscribe to its messages"
      );
    }
  }
);

export const directMessageSubscription = createResolver(
  async (parent, { teamId, userId }, { user, models }) => {
    if (!user || !user.id) {
      throw new Error("Not authenticated");
    }

    const members = await models.Member.findAll({
      where: {
        teamId,
        [models.sequelize.Op.or]: [{ userId }, { userId: user.id }]
      }
    });
    if (members.length !== 2) {
      throw new Error("Something went Wrong");
    }
  }
);
