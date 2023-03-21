import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";
import { createApolloProvider } from "@vue/apollo-option";

// apollo client setup
const httpLink = createHttpLink({
  uri: "https://api.start.gg/gql/alpha",
});

// handle api authentication
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("api-token") || import.meta.env.VITE_TOKEN;
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const cache = new InMemoryCache();

const apolloClient = new ApolloClient({
  cache,
  link: authLink.concat(httpLink),
});

export const apolloProvider = createApolloProvider({
  defaultClient: apolloClient,
});
