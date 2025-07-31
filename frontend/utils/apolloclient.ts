import createApolloClient from "@/apollo-client";
import { getpost,getstory, getuserstory } from '@/queries/Queries';

export const getUser = async ({userId}:{userId:string}) =>{
    const client = await createApolloClient();
    const {data} = await client.query({
        query: getpost,
        variables: {
            id: userId,
            owner: userId
        },
    });
    return data
}

export const getuserstorys = async ({ids}:{ids:string[]}) =>{
    const client = await createApolloClient();
    const {data} = await client.query({
        query: getuserstory,
        variables: {
            following: ids,
        },
    });
    return data
}

export const getstorys = async ({ids}:{ids:string[]}) =>{
    const client = await createApolloClient();
    const {data} = await client.query({
        query: getstory,
        variables: {
            following: ids,
        },
    });
    return data
}