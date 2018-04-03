import { split } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { ApolloClient, InMemoryCache, HttpLink } from "apollo-boost";
import { ApolloLink, from } from "apollo-link";
import createFileLink from "./createFileLink";

const getTokenMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers }) => ({
    headers: {
      ...headers,
      "x-token": localStorage.getItem("token") || null,
      "x-refresh-token": localStorage.getItem("refreshToken") || null
    }
  }));

  return forward(operation);
});

const setTokenAfterware = new ApolloLink((operation, forward) =>
  forward(operation).map(res => {
    const context = operation.getContext();
    const { response: { headers } } = context;

    const token = headers.get("x-token");
    const refreshToken = headers.get("x-refresh-token");

    if (token) {
      localStorage.setItem("token", token);
    }
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }

    return res;
  })
);

const httpLink = createFileLink({ uri: "http://localhost:8081/graphql" });
const httpLinkWithMiddlewares = from([
  getTokenMiddleware,
  setTokenAfterware.concat(httpLink)
]);

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: `ws://localhost:8081/subscriptions`,
  options: {
    reconnect: true,
    connectionParams: () => ({
      token: localStorage.getItem("token"),
      refreshToken: localStorage.getItem("refreshToken")
    })
  }
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLinkWithMiddlewares
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});
export default client;
