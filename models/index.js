const Sequelize = require("sequelize");

const sequelize = new Sequelize("slack", "postgres", "postgres", {
  dialect: "postgres",
  host: "localhost",
  operatorsAliases: false
});

const models = {
  User: sequelize.import("./user"),
  Channel: sequelize.import("./channel"),
  Message: sequelize.import("./message"),
  Team: sequelize.import("./team")
};

Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
