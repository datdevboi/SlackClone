"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _auth = require("../auth");

var _formatErrors = require("../formatErrors");

var _formatErrors2 = _interopRequireDefault(_formatErrors);

var _permissions = require("../permissions");

var _permissions2 = _interopRequireDefault(_permissions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  User: {
    teams: function teams(parent, args, _ref, info) {
      var models = _ref.models,
          user = _ref.user;
      return models.sequelize.query("select * from teams as team join members as member on team.id = member.team_id where member.user_id = ?", {
        replacements: [user.id],
        model: models.Team,
        raw: true
      });
    }
  },
  Query: {
    getUser: _permissions2.default.createResolver(function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(parent, _ref3, _ref4, info) {
        var userId = _ref3.userId;
        var models = _ref4.models;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", models.User.findOne({
                  where: {
                    id: userId
                  }
                }));

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, undefined);
      }));

      return function (_x, _x2, _x3, _x4) {
        return _ref2.apply(this, arguments);
      };
    }()),
    me: _permissions2.default.createResolver(function (parent, args, context) {
      var models = context.models,
          user = context.user;

      return models.User.findOne({ where: { id: user.id } });
    }),
    allUsers: function allUsers(parent, args, context) {
      var models = context.models;

      return models.User.findAll();
    },
    inviteTeams: _permissions2.default.createResolver(function () {
      var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(parent, args, _ref6) {
        var models = _ref6.models,
            user = _ref6.user;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", models.Team.findAll({
                  include: [{
                    model: models.User,
                    where: { id: user.id }
                  }]
                }, { raw: true }));

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, undefined);
      }));

      return function (_x5, _x6, _x7) {
        return _ref5.apply(this, arguments);
      };
    }())
  },
  Mutation: {
    login: function login(parent, args, context) {
      var email = args.email,
          password = args.password;

      return (0, _auth.tryLogin)(email, password, context.models, context.SECRET, context.SECRET2);
    },
    register: function () {
      var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(parent, args, context) {
        var models, user;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                models = context.models;
                _context3.prev = 1;
                _context3.next = 4;
                return models.User.create(args);

              case 4:
                user = _context3.sent;
                return _context3.abrupt("return", {
                  ok: true,
                  user: user
                });

              case 8:
                _context3.prev = 8;
                _context3.t0 = _context3["catch"](1);
                return _context3.abrupt("return", {
                  ok: false,
                  errors: (0, _formatErrors2.default)(_context3.t0, models)
                });

              case 11:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, undefined, [[1, 8]]);
      }));

      return function register(_x8, _x9, _x10) {
        return _ref7.apply(this, arguments);
      };
    }()
  }
};