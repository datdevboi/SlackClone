import express from "express";
import bodyParser from "body-parser";
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import { makeExecutableSchema } from "graphql-tools";
import path from "path";
import jwt from "jsonwebtoken";
import { fileLoader, mergeTypes, mergeResolvers } from "merge-graphql-schemas";
import { execute, subscribe } from "graphql";

import { SubscriptionServer } from "subscriptions-transport-ws";
import { createServer } from "http";
import cors from "cors";
import { refreshTokens } from "./auth";
import models from "./models";

const SECRET = "foijdmgikjmnsdghgmnikjjankdhgi";
const SECRET2 = "FAFDFJOIGJG515415454";

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, "./schema")));

const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname, "./resolvers"))
);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const app = express();

app.use(cors("*"));

const addUser = async (req, res, next) => {
  const token = req.headers["x-token"];
  if (token) {
    try {
      const { user } = jwt.verify(token, SECRET);
      req.user = user;
    } catch (err) {
      const refreshToken = req.headers["x-refresh-token"];
      const newTokens = await refreshTokens(
        token,
        refreshToken,
        models,
        SECRET,
        SECRET2
      );
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

app.use(addUser);

const graphqlEndpoint = "/graphql";

// bodyParser is needed just for POST.
app.use(
  graphqlEndpoint,
  bodyParser.json(),
  graphqlExpress(req => ({
    schema,
    context: {
      models,
      user: req.user,
      SECRET,
      SECRET2
    }
  }))
);

app.use(
  "/graphiql",
  graphiqlExpress({
    endpointURL: graphqlEndpoint,
    subscriptionsEndpoint: "ws//localhost:8081/subscriptions"
  })
);
const server = createServer(app);

models.sequelize.sync().then(() => {
  server.listen(8081, () => {
    // eslint-disable-next-line
    new SubscriptionServer(
      {
        execute,
        subscribe,
        schema,
        onConnect: async (connectionParams, webSocket) => {
          if (connectionParams.token && connectionParams.refreshToken) {
            let user = null;
            try {
              const payload = jwt.verify(connectionParams.token, SECRET);
              user = payload.user;
            } catch (err) {
              const newTokens = await refreshTokens(
                connectionParams.token,
                connectionParams.refreshToken,
                models,
                SECRET,
                SECRET2
              );

              user = newTokens.user;
            }
            if (!user) {
              throw new Error("Invaid auth tokens");
            }
            const member = await models.Member.findOne({
              where: { teamId: 1, userId: user.id }
            });

            if (!member) {
              throw new Error("Missing auth tokens");
            }

            return true;
          }
        }
      },
      {
        server,
        path: "/subscriptions"
      }
    );
  });
});
