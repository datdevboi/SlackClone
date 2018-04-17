"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _defineProperty2 = require("babel-runtime/helpers/defineProperty");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _formatErrors = require("../formatErrors");

var _formatErrors2 = _interopRequireDefault(_formatErrors);

var _permissions = require("../permissions");

var _permissions2 = _interopRequireDefault(_permissions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  Mutation: {
    getOrCreateChannel: _permissions2.default.createResolver(function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(parent, _ref2, _ref3, info) {
        var teamId = _ref2.teamId,
            members = _ref2.members;
        var models = _ref3.models,
            user = _ref3.user;

        var member, allMembers, _ref4, _ref5, data, result, users, name, newChannelId;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return models.Member.findOne({ where: { userId: user.id, teamId: teamId } }, { raw: true });

              case 2:
                member = _context2.sent;

                if (member) {
                  _context2.next = 5;
                  break;
                }

                throw new Error("Not authorized");

              case 5:
                allMembers = [].concat((0, _toConsumableArray3.default)(members), [user.id]);

                // check if dm channel already exist with these members

                _context2.next = 8;
                return models.sequelize.query("select c.id , c.name\n        from channels as c, pcmembers pc \n        where pc.channel_id = c.id and c.dm = true and c.public = false and c.team_id = " + teamId + "\n        group by c.id , c.name\n        having array_agg(pc.user_id) @> Array[" + allMembers.join(",") + "] and count(pc.user_id) = " + allMembers.length + ";", {
                  raw: true
                });

              case 8:
                _ref4 = _context2.sent;
                _ref5 = (0, _slicedToArray3.default)(_ref4, 2);
                data = _ref5[0];
                result = _ref5[1];

                if (!data.length) {
                  _context2.next = 14;
                  break;
                }

                return _context2.abrupt("return", data[0]);

              case 14:
                _context2.next = 16;
                return models.User.findAll({
                  raw: true,
                  where: {
                    id: (0, _defineProperty3.default)({}, models.sequelize.Op.in, members)
                  }
                });

              case 16:
                users = _context2.sent;
                name = users.map(function (u) {
                  return u.username;
                }).join(", ");
                _context2.next = 20;
                return models.sequelize.transaction(function () {
                  var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(transaction) {
                    var channel, pcmembers;
                    return _regenerator2.default.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            _context.next = 2;
                            return models.Channel.create({
                              name: name,
                              public: false,
                              dm: true,
                              teamId: teamId
                            }, {
                              transaction: transaction
                            });

                          case 2:
                            channel = _context.sent;
                            pcmembers = allMembers.map(function (m) {
                              return {
                                userId: m,
                                channelId: channel.dataValues.id
                              };
                            });
                            _context.next = 6;
                            return models.PCMember.bulkCreate(pcmembers, { transaction: transaction });

                          case 6:
                            return _context.abrupt("return", channel.dataValues.id);

                          case 7:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee, undefined);
                  }));

                  return function (_x5) {
                    return _ref6.apply(this, arguments);
                  };
                }());

              case 20:
                newChannelId = _context2.sent;
                return _context2.abrupt("return", { id: newChannelId, name: name });

              case 22:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, undefined);
      }));

      return function (_x, _x2, _x3, _x4) {
        return _ref.apply(this, arguments);
      };
    }()),
    createChannel: _permissions2.default.createResolver(function () {
      var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(parent, args, context, info) {
        var models, user, member, response;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                models = context.models, user = context.user;
                _context4.prev = 1;
                _context4.next = 4;
                return models.Member.findOne({ where: { userId: user.id, teamId: args.teamId } }, { raw: true });

              case 4:
                member = _context4.sent;

                if (member.admin) {
                  _context4.next = 7;
                  break;
                }

                return _context4.abrupt("return", {
                  ok: false,
                  errors: [{
                    path: "name",
                    message: "You have to be the admin to the team to create channels"
                  }]
                });

              case 7:
                _context4.next = 9;
                return models.sequelize.transaction(function () {
                  var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(transaction) {
                    var channel, members;
                    return _regenerator2.default.wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            _context3.next = 2;
                            return models.Channel.create(args, {
                              transaction: transaction
                            });

                          case 2:
                            channel = _context3.sent;

                            if (args.public) {
                              _context3.next = 8;
                              break;
                            }

                            members = args.members.filter(function (m) {
                              return m !== user.id;
                            });

                            members.push(user.id);
                            _context3.next = 8;
                            return models.PCMember.bulkCreate(members.map(function (m) {
                              return {
                                userId: m,
                                channelId: channel.dataValues.id
                              };
                            }), { transaction: transaction });

                          case 8:
                            return _context3.abrupt("return", channel);

                          case 9:
                          case "end":
                            return _context3.stop();
                        }
                      }
                    }, _callee3, undefined);
                  }));

                  return function (_x10) {
                    return _ref8.apply(this, arguments);
                  };
                }());

              case 9:
                response = _context4.sent;
                return _context4.abrupt("return", {
                  ok: true,
                  channel: response
                });

              case 13:
                _context4.prev = 13;
                _context4.t0 = _context4["catch"](1);
                return _context4.abrupt("return", {
                  ok: false,
                  errors: (0, _formatErrors2.default)(_context4.t0, models)
                });

              case 16:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, undefined, [[1, 13]]);
      }));

      return function (_x6, _x7, _x8, _x9) {
        return _ref7.apply(this, arguments);
      };
    }())
  }
};