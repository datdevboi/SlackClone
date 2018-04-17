"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _formatErrors = require("../formatErrors");

var _formatErrors2 = _interopRequireDefault(_formatErrors);

var _permissions = require("../permissions");

var _permissions2 = _interopRequireDefault(_permissions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  Mutation: {
    getOrCreateChannel: _permissions2.default.createResolver(async (parent, { teamId, members }, { models, user }, info) => {
      const member = await models.Member.findOne({ where: { userId: user.id, teamId } }, { raw: true });

      if (!member) {
        throw new Error("Not authorized");
      }
      const allMembers = [...members, user.id];

      // check if dm channel already exist with these members
      const [data, result] = await models.sequelize.query(`select c.id , c.name
        from channels as c, pcmembers pc 
        where pc.channel_id = c.id and c.dm = true and c.public = false and c.team_id = ${teamId}
        group by c.id , c.name
        having array_agg(pc.user_id) @> Array[${allMembers.join(",")}] and count(pc.user_id) = ${allMembers.length};`, {
        raw: true
      });

      if (data.length) {
        return data[0];
      }

      const users = await models.User.findAll({
        raw: true,
        where: {
          id: {
            [models.sequelize.Op.in]: members
          }
        }
      });

      const name = users.map(u => u.username).join(", ");

      const newChannelId = await models.sequelize.transaction(async transaction => {
        const channel = await models.Channel.create({
          name,
          public: false,
          dm: true,
          teamId
        }, {
          transaction
        });

        const pcmembers = allMembers.map(m => ({
          userId: m,
          channelId: channel.dataValues.id
        }));

        await models.PCMember.bulkCreate(pcmembers, { transaction });

        return channel.dataValues.id;
      });

      return { id: newChannelId, name };
    }),
    createChannel: _permissions2.default.createResolver(async (parent, args, context, info) => {
      const { models, user } = context;
      try {
        const member = await models.Member.findOne({ where: { userId: user.id, teamId: args.teamId } }, { raw: true });

        if (!member.admin) {
          return {
            ok: false,
            errors: [{
              path: "name",
              message: "You have to be the admin to the team to create channels"
            }]
          };
        }

        const response = await models.sequelize.transaction(async transaction => {
          const channel = await models.Channel.create(args, {
            transaction
          });

          if (!args.public) {
            const members = args.members.filter(m => m !== user.id);
            members.push(user.id);
            await models.PCMember.bulkCreate(members.map(m => ({
              userId: m,
              channelId: channel.dataValues.id
            })), { transaction });
          }

          return channel;
        });

        return {
          ok: true,
          channel: response
        };
      } catch (error) {
        return {
          ok: false,
          errors: (0, _formatErrors2.default)(error, models)
        };
      }
    })
  }
};