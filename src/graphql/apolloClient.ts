// apolloClient.ts
import { ApolloClient, InMemoryCache, split } from "@apollo/client";
import { WebSocketLink } from '@apollo/client/link/ws';
import { HttpLink } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";

// Create an HTTP link for queries and mutations
const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL,
});

// Create a WebSocket link for subscriptions
const wsLink = new WebSocketLink({
  uri: import.meta.env.VITE_GRAPHQL_WS_URL,
  options: {
    reconnect: true,
  },
});

// Split links based on operation type
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

// Initialize Apollo Client
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;
