import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { cookies } from "next/headers";

const createApolloClient = async () => {
  const token = (await cookies()).get('token')?.value || ''
  const httpLink = new HttpLink({
    uri: `${process.env.NEXT_PUBLIC_BASE_URL}/data`,
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