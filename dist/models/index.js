"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Sequelize = require("sequelize");

var sequelize = new Sequelize(process.env.TEST_DB || "slack", "postgres", "postgres", {
  dialect: "postgres",
  operatorsAliases: Sequelize.Op,
  host: "localhost",
  define: {
    underscored: true
  }
});

var models = {
  User: sequelize.import("./user"),
  Channel: sequelize.import("./channel"),
  Message: sequelize.import("./message"),
  Team: sequelize.import("./team"),
  Member: sequelize.import("./member"),
  DirectMessage: sequelize.import("./directMessage"),
  PCMember: sequelize.import("./pcmember")
};

(0, _keys2.default)(models).forEach(function (modelName) {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

exports.default = models;