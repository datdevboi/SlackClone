"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _auth = require("../auth");

var _formatErrors = require("../formatErrors");

var _formatErrors2 = _interopRequireDefault(_formatErrors);

var _permissions = require("../permissions");

var _permissions2 = _interopRequireDefault(_permissions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  User: {
    teams: (parent, args, { models, user }, info) => models.sequelize.query("select * from teams as team join members as member on team.id = member.team_id where member.user_id = ?", {
      replacements: [user.id],
      model: models.Team,
      raw: true
    })
  },
  Query: {
    getUser: _permissions2.default.createResolver(async (parent, { userId }, { models }, info) => models.User.findOne({
      where: {
        id: userId
      }
    })),
    me: _permissions2.default.createResolver((parent, args, context) => {
      const { models, user } = context;
      return models.User.findOne({ where: { id: user.id } });
    }),
    allUsers: (parent, args, context) => {
      const { models } = context;
      return models.User.findAll();
    },
    inviteTeams: _permissions2.default.createResolver(async (parent, args, { models, user }) => models.Team.findAll({
      include: [{
        model: models.User,
        where: { id: user.id }
      }]
    }, { raw: true }))
  },
  Mutation: {
    login: (parent, args, context) => {
      const { email, password } = args;
      return (0, _auth.tryLogin)(email, password, context.models, context.SECRET, context.SECRET2);
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
          errors: (0, _formatErrors2.default)(error, models)
        };
      }
    }
  }
};