import express from "express";
import bodyParser from "body-parser";
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import { makeExecutableSchema } from "graphql-tools";
import models from "./models";

import typeDefs from "./schema";
import resolvers from "./resolvers";

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const app = express();

const graphqlEndpoint = "/graphql";

// bodyParser is needed just for POST.
app.use("/graphql", bodyParser.json(), graphqlExpress({ schema }));

app.use("/graphiql", graphiqlExpress({ endpointURL: graphqlEndpoint }));

models.sequelize.sync().then(() => {
  app.listen(8081);
});
