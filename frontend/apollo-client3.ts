import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client'

const httpLink = new HttpLink({
  uri: `${process.env.NEXT_PUBLIC_BASE_URL}/data`,
  credentials: 'include',
})

const authLink = new ApolloLink((operation, forward) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : ''
  operation.setContext({
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  })
  return forward(operation)
})

const createApolloClient = () =>
  new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
})

export default createApolloClient