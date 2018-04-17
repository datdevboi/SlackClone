"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const Sequelize = require("sequelize");

const sequelize = new Sequelize(process.env.TEST_DB || "slack", "postgres", "postgres", {
  dialect: "postgres",
  operatorsAliases: Sequelize.Op,
  host: "localhost",
  define: {
    underscored: true
  }
});

const models = {
  User: sequelize.import("./user"),
  Channel: sequelize.import("./channel"),
  Message: sequelize.import("./message"),
  Team: sequelize.import("./team"),
  Member: sequelize.import("./member"),
  DirectMessage: sequelize.import("./directMessage"),
  PCMember: sequelize.import("./pcmember")
};

Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

exports.default = models;