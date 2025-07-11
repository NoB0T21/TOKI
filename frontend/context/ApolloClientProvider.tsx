'use client'
import { ApolloProvider } from '@apollo/client'
import createApolloClient from '@/apollo-client3'

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  const client = createApolloClient() // Should be non-async in client
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}