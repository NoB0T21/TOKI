import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { cookies } from "next/headers";

const createApolloClient = async () => {
  const token = (await cookies()).get('token')?.value || ''
  const httpLink = new HttpLink({
    uri: 'http://localhost:4000/data',
    credentials: 'include',
    fetch,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return new ApolloClient({
    ssrMode: true,
    link: httpLink,
    cache: new InMemoryCache(),
  });
};

export default createApolloClient;