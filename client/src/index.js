import React from "react";
import ReactDOM from "react-dom";
import registerServiceWorker from "./registerServiceWorker";
import { ApolloProvider } from "react-apollo";

import client from "./apollo";
import Routes from "./routes";
import "semantic-ui-css/semantic.min.css";

const App = () => (
  <ApolloProvider client={client}>
    <Routes />
  </ApolloProvider>
);

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
