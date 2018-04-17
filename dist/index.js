"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _apolloServerExpress = require("apollo-server-express");

var _graphqlTools = require("graphql-tools");

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _mergeGraphqlSchemas = require("merge-graphql-schemas");

var _graphql = require("graphql");

var _formidable = require("formidable");

var _formidable2 = _interopRequireDefault(_formidable);

var _dataloader = require("dataloader");

var _dataloader2 = _interopRequireDefault(_dataloader);

var _subscriptionsTransportWs = require("subscriptions-transport-ws");

var _http = require("http");

var _cors = require("cors");

var _cors2 = _interopRequireDefault(_cors);

var _auth = require("./auth");

var _models = require("./models");

var _models2 = _interopRequireDefault(_models);

var _batchFunctions = require("./batchFunctions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const SECRET = "foijdmgikjmnsdghgmnikjjankdhgi";
const SECRET2 = "FAFDFJOIGJG515415454";

const typeDefs = (0, _mergeGraphqlSchemas.mergeTypes)((0, _mergeGraphqlSchemas.fileLoader)(_path2.default.join(__dirname, "./schema")));

const resolvers = (0, _mergeGraphqlSchemas.mergeResolvers)((0, _mergeGraphqlSchemas.fileLoader)(_path2.default.join(__dirname, "./resolvers")));

const schema = (0, _graphqlTools.makeExecutableSchema)({
  typeDefs,
  resolvers
});

const app = (0, _express2.default)();

app.use((0, _cors2.default)("*"));

const addUser = async (req, res, next) => {
  const token = req.headers["x-token"];
  if (token) {
    try {
      const { user } = _jsonwebtoken2.default.verify(token, SECRET);
      req.user = user;
    } catch (err) {
      const refreshToken = req.headers["x-refresh-token"];
      const newTokens = await (0, _auth.refreshTokens)(token, refreshToken, _models2.default, SECRET, SECRET2);
      if (newTokens.token && newTokens.refreshToken) {
        res.set("Access-Control-Expose-Headers", "x-token, x-refresh-token");
        res.set("x-token", newTokens.token);
        res.set("x-refresh-token", newTokens.refreshToken);
      }
      req.user = newTokens.user;
    }
  }
  next();
};

const uploadDir = "files";

const fileMiddleware = (req, res, next) => {
  if (!req.is("multipart/form-data")) {
    return next();
  }

  const form = _formidable2.default.IncomingForm({
    uploadDir
  });

  form.parse(req, (error, { operations }, files) => {
    if (error) {}

    const document = JSON.parse(operations);

    if (Object.keys(files).length) {
      const { file: { type, path: filePath } } = files;

      document.variables.file = {
        type,
        path: filePath
      };
    }

    req.body = document;
    next();
  });
};

app.use(addUser);

const graphqlEndpoint = "/graphql";

// bodyParser is needed just for POST.
app.use(graphqlEndpoint, _bodyParser2.default.json(), fileMiddleware, (0, _apolloServerExpress.graphqlExpress)(req => ({
  schema,
  context: {
    models: _models2.default,
    user: req.user,
    SECRET,
    SECRET2,
    channelLoader: new _dataloader2.default(ids => (0, _batchFunctions.channelBatcher)(ids, _models2.default, req.user)),
    serverUrl: `${req.protocol}://${req.get("host")}`
  }
})));

app.use("/graphiql", (0, _apolloServerExpress.graphiqlExpress)({
  endpointURL: graphqlEndpoint,
  subscriptionsEndpoint: "ws://localhost:8081/subscriptions"
}));

app.use("/files", _express2.default.static("files"));
const server = (0, _http.createServer)(app);

_models2.default.sequelize.sync({}).then(() => {
  server.listen(8081, () => {
    // eslint-disable-next-line
    new _subscriptionsTransportWs.SubscriptionServer({
      execute: _graphql.execute,
      subscribe: _graphql.subscribe,
      schema,
      onConnect: async (connectionParams, webSocket) => {
        if (connectionParams.token && connectionParams.refreshToken) {
          try {
            const { user } = _jsonwebtoken2.default.verify(connectionParams.token, SECRET);
            return {
              models: _models2.default,
              user
            };
          } catch (err) {
            const newTokens = await (0, _auth.refreshTokens)(connectionParams.token, connectionParams.refreshToken, _models2.default, SECRET, SECRET2);

            return {
              models: _models2.default,
              user: newTokens.user
            };
          }
        }
        return { models: _models2.default };
      }
    }, {
      server,
      path: "/subscriptions"
    });
  });
});