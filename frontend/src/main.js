import { createApp } from 'vue'
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import { createApolloProvider } from '@vue/apollo-option'

import '@/style.css'
import App from './App.vue'

// apollo client setup
const httpLink = createHttpLink({
  uri: 'https://api.start.gg/gql/alpha'
})

const authLink = setContext((_, { headers }) => {
  // const token = localStorage.getItem('token');
  const token = import.meta.env.VITE_TOKEN
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
})

const cache = new InMemoryCache()

const apolloClient = new ApolloClient({
  cache,
	link: authLink.concat(httpLink)
})

const apolloProvider = createApolloProvider({
  defaultClient: apolloClient,
})

// create vue app and use apollo provider
createApp(App)
	.use(apolloProvider)
	.mount('#app')
