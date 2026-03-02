// import { NextRequest, NextResponse } from "next/server";
// import { api } from "./utils/api";

// export async function middleware (request: NextRequest){
//     const path = request.nextUrl.pathname;
//     const isPublicRout = path === '/sign-up' || path === '/sign-in'
//     let token = request.cookies.get('token')?.value;

//     try {
//         const user = await api.get('/user/valid',{
//             headers:{
//                 Authorization:`Bearer ${token}`,
//             },
            
//             withCredentials:true
//         })
//         const verified:boolean = user.data.success
//         if(token && isPublicRout && verified ){
//             const res = NextResponse.redirect(new URL('/',request.url))
//             res.headers.set('x-middleware-cache', 'no-cache');
//             return res
//         }
        
//     } catch (error) {
//         request.cookies.set('token', '')
//         const res = NextResponse.redirect(new URL('/sign-in',request.url))
//         res.headers.set('x-middleware-cache', 'no-cache');
//         return res
//     }

//     const res = NextResponse.next();
//     res.headers.set('x-middleware-cache', 'no-cache');
//     return res
// }

// export const config = {
//     matcher: ['/']
// }