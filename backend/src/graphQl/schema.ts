import { GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql"
import posts from '../models/posts.models'
import user from "../models/user.model"
import following from "../models/user.following.model"
import follower from "../models/user.followers.model"
import like from '../models/like.model'
import PostCount from "../models/post.count.model"
import storyModel from "../models/user.story.model"
import storyview from "../models/story.views"

const now = new Date();

const UserFollowingType = new GraphQLObjectType({
    name:'UserFollowing',
    fields:()=>({
        userID:{type: GraphQLString},
        count:{type: new GraphQLList(GraphQLString)},
        folloingCount:{type:GraphQLInt}
    })
})

const PostLikeType = new GraphQLObjectType({
    name:'PostLike',
    fields:()=>({
        id: {type: GraphQLID},
        like:{type: new GraphQLList(GraphQLString)},
        likeCount:{type:GraphQLInt}
    })
})

const PostcountType = new GraphQLObjectType({
    name:'PostCount',
    fields:()=>({
        owner: {type: GraphQLID},
        postcount:{type: GraphQLInt},
    })
})

const UserFollowersType = new GraphQLObjectType({
    name:'UserFollower',
    fields:()=>({
        userID:{type: GraphQLString},
        count:{type: new GraphQLList(GraphQLString)},
        followerCount:{type:GraphQLInt}
    })
})

const StoryviewType = new GraphQLObjectType({
    name:'storyViews',
    fields:()=>({
        storyID:{type: GraphQLString},
        count:{type: new GraphQLList(GraphQLString)},
        storyviewsCount:{type:GraphQLInt}
    })
})

const UserType = new GraphQLObjectType({
    name:'User',
    fields:()=>({
        id:{type: GraphQLID},
        name:{type: GraphQLString},
        email:{type: GraphQLString},
        picture:{type: GraphQLString},
        postcount:{
            type: PostcountType,
            resolve(parent,args){
                return PostCount.findOne({owner:parent.id})
            }
        },
        following:{
            type:UserFollowingType,
            resolve(parent,args){
                return following.findOne({userID:parent.id})
            }
        },
        follower:{
            type:UserFollowersType,
            resolve(parent,args){
                return follower.findOne({userID:parent.id})
            }
        }
    })
})

const PostType:any = new GraphQLObjectType({
    name:'Post',
    fields:()=>({
        id:{type: GraphQLID},
        creator:{type: GraphQLString},
        title:{type: GraphQLString},
        message:{type: GraphQLString},
        tags:{type: new GraphQLList(GraphQLString)},
        pictureURL:{type: GraphQLString},
        originalname:{type: GraphQLString},
        createdAt:{type: GraphQLString},
        owner:{type: GraphQLString},
        like:{
            type:PostLikeType,
            resolve(parent,args){
                return like.findOne({userID:parent.id})
            }
        },
        posts:{
            type: UserType,
            resolve(parent,args){
                return posts.findById({_id:parent.owner})
            }
        },
        following:{
            type:UserFollowingType,
            resolve(parent,args){
                return following.findOne({userID:parent.owner})
            }
        },
        follower:{
            type:UserFollowingType,
            resolve(parent,args){
                return follower.findOne({userID:parent.owner})
            }
        },
        user:{
            type:UserType,
            args:{id:{type:GraphQLID}},
            resolve(parent,args){
                return user.findById(parent.owner)
            }
        }
    })
})

const StoryType = new GraphQLObjectType({
    name:'Userstory',
    fields:()=>({
        id:{type: GraphQLID},
        userID:{type: GraphQLString},
        imageUrl:{type: GraphQLString},
        createdAt:{type: GraphQLString},
        views:{
            type:StoryviewType,
            resolve(parent,args){
                return storyview.findOne({storyID:parent._id})
            }
        }
    })
})

 const UserStoryType = new GraphQLObjectType({
     name:'UserStory',
     fields:()=>({
         id:{type: GraphQLID},
         name:{type: GraphQLString},
         email:{type: GraphQLString},
         picture:{type: GraphQLString},
         follower:{
             type:UserFollowersType,
             resolve(parent,args){
                 return follower.findOne({userID:parent.id})
             }
         },
         stories: {
            type: new GraphQLList(StoryType),
            resolve(parent,args){
                return storyModel.find({
                userID: parent.id,
                expiresAt: { $gt: now }
                }).sort({ createdAt: -1 })
            }
        },
     })
 })

const RootQuery = new GraphQLObjectType({
    name:'RootQuertType',
    fields:{
        post:{
            type:PostType,
            args: {id: {type: GraphQLID}},
            resolve(parent,args){
                return posts.findById(args.id)
            }
        },
        user:{
            type:UserType,
            args:{id:{type:GraphQLID}},
            resolve(parent,args){
                return user.findById(args.id)
            }
        },
        posts:{
            type:new GraphQLList(PostType),
            args: {
                owner:{type: GraphQLString},
                offset: { type: GraphQLInt },
                limit: { type: GraphQLInt }, 
            },

            resolve(parent,args){
                return posts.find({owner: args.owner})
                .sort({ createdAt: -1 })
                .skip(args.offset || 0)
                .limit(args.limit || 5)
            }
        },
        exploreposts:{
            type:new GraphQLList(PostType),
            args: {
                offset: { type: GraphQLInt },
                limit: { type: GraphQLInt },
                excludeOwner: { type: GraphQLID },
            },

            resolve: async (parent,args) => {
                const randomPosts = await posts.find({owner: { $ne: args.excludeOwner }})
                .skip(args.offset || 0)
                .limit(args.limit || 5)

                return randomPosts.sort(() => Math.random()-0.6);
            }
        },
        followinguser:{
            type:new GraphQLList(UserType),
            args:{
                offset: { type: GraphQLInt },
                limit: { type: GraphQLInt },
                userIds:{type:new GraphQLList(GraphQLID)}
            },
            resolve(parent,args){
                return user.find({_id: {$in: args.userIds}})
                .skip(args.offset || 0)
                .limit(args.limit || 5)
            }
        },
        homeposts:{
            type:new GraphQLList(PostType),
            args: {
                offset: { type: GraphQLInt },
                limit: { type: GraphQLInt },
                homeOwner: { type: new  GraphQLList(GraphQLID) },
            },

            resolve: async (parent,args) => {
                const randomPosts = await posts.find({owner: { $in: args.homeOwner }})
                .skip(args.offset || 0)
                .limit(args.limit || 5)

                return randomPosts.sort(() => Math.random()-0.6);
            }
        },
        userstories: {
            type: new GraphQLList(UserStoryType),
            args: {
                following: { type: new GraphQLList(GraphQLID) },
            },
            resolve: async (parent, args) => {
                const users = await user.find({ _id: { $in: args.following } });
                const usersWithStories = await Promise.all(
                users.map(async (u) => {
                    const hasStory = await storyModel.exists({
                    userID: u._id,
                    expiresAt: { $gt: now },
                    });
                    return hasStory ? u : null;
                })
                );
                return usersWithStories.filter(Boolean);;
            }
            }
    }
})

const graphQLschema = new GraphQLSchema({
    query: RootQuery,
});

export default graphQLschema