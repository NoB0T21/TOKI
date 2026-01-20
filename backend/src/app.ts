import { graphqlHTTP } from 'express-graphql';
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
import userRoutes from './routes/user.route'
import postsRoutes from './routes/post.route'
import storyRoutes from './routes/story.route'
import songRoutes from './routes/Songs.route'
import database from './Db/mongodb';
import schema from './graphQl/schema'
import middleware from './middleware/middleware';

dotenv.config()
database();
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors({
    origin: process.env.CLIENT_URL || 'none',
    credentials: true,
}))

app.use('/user',userRoutes)
app.use('/post',postsRoutes)
app.use('/story',storyRoutes)
app.use('/music',songRoutes)
app.use('/data',middleware,graphqlHTTP({schema,graphiql:true}))

app.use('/gg',graphqlHTTP({schema,graphiql:true}));

app.get('/',(req: Request,res: Response)=>{
    res.status(200).json({
        message: "hello",
        success: true
    })
})

export default app
