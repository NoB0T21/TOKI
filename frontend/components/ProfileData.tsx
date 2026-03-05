'use client'
import { useEffect, useState } from 'react'
import Following from './card/Following'
import Followers from './card/Followers'
import StoryViewer from './story/StoryViewer'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { addPosts, increaseSkip } from '@/state/userProfilefollowings'
import { getProfileFollowingdata } from '@/utils/clientAction'
import { addprofileFollowing, increaseSkipofprofile } from '@/state/profileFollowing'
import { AnimatePresence, motion } from 'motion/react'

interface User {
    picture:string,
    posts:number|undefined,
    follower:number,
    following:number,
    followinglist:string[],
    followerlist:string[]
    id:string,
    userid?: string
    name: string
}

function paginateIds(ids: string[], page: number, limit: number=3) {
  const start = (page - 1) * limit;
  const end = start + limit;
  return ids.slice(start, end);
}

const ProfileData = ({picture,posts,follower,following,followerlist,followinglist,id,userid, name}:User) => {
  const dispatch = useDispatch();
  let usersfollowing
  let skip
  let hasMore
  usersfollowing = useSelector((state: RootState) => userid ? state.userProfilefollowings.userprofileFollowing : state.profileFollowing.profileFollowing);
  userid ? skip = useSelector((state: RootState) => state.userProfilefollowings.skip) : skip = useSelector((state: RootState) => state.profileFollowing.skip);
  userid ? hasMore = useSelector((state: RootState) => state.userProfilefollowings.hasMore) : hasMore = useSelector((state: RootState) => state.profileFollowing.hasMore);
  const [showFlowing, setShowFlowing] = useState(false);
  const [showFlower, setShowFlower] = useState(false);
  const [showsory, setShowsory] = useState(false);
  const [story,Setstory] = useState<any>()

  const fetchMorefollowing = async () => {
    if (!hasMore) return;
    const followinguser = await getProfileFollowingdata(paginateIds(followinglist, skip, 14), skip, 14)      
    const newPosts = followinguser || [];
    if (newPosts.length) dispatch(userid ?addPosts(followinguser): addprofileFollowing(followinguser));
  }
  
  const handleFollowingScroll = (e: React.UIEvent<HTMLElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (Math.round(scrollTop + clientHeight) >= scrollHeight && hasMore) {
      userid ? dispatch(increaseSkip()) : dispatch(increaseSkipofprofile());
    }
  };

  useEffect(() => {
    fetchMorefollowing();
  }, [skip]);

  return (
    <>
      {/* Profile Info */}
      <div className="px-4 py-5">
        <div className="flex items-center gap-6">
          <div onClick={()=>setShowsory(true)} className={`h-20 w-20 rounded-full p-[2px] flex-shrink-0 ${story && 'gradient-story border-2'}`}>
            <img src={picture} alt="Profile" className="h-full w-full rounded-full object-cover border-2 border-background" />
          </div>
          <div className="flex-1 grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-lg font-bold font-display text-foreground">{posts}</p>
              <p className="text-xs text-muted-foreground">Posts</p>
            </div>
            <div onClick={()=>setShowFlower(true)}>
              <p  className="text-lg font-bold font-display text-foreground">{follower}</p>
              <p className="text-xs text-muted-foreground">Followers</p>
            </div>
            <div onClick={()=>setShowFlowing(true)}>
              <p className="text-lg font-bold font-display text-foreground">{following}</p>
              <p className="text-xs text-muted-foreground">Following</p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-semibold text-foreground">{name}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Digital designer & photographer 📸{"\n"}
            Creating visual stories ✨{"\n"}
            NYC 🗽
          </p>
          <a href="#" className="text-sm text-primary mt-1 block">linktr.ee/yoyo</a>
        </div>

        <div className="flex gap-2 mt-4">
          <button className="flex-1 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">
            Edit Profile
          </button>
          <button className="flex-1 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold">
            Share Profile
          </button>
        </div>
      </div>

      {/* Highlights */}
      {/* <div className="flex gap-4 px-4 pb-4 overflow-x-auto scrollbar-hide">
        {["Travel", "Food", "Art", "NYC"].map((highlight) => (
          <div key={highlight} className="flex flex-col items-center gap-1 flex-shrink-0">
            <div className="h-16 w-16 rounded-full border-2 border-border flex items-center justify-center bg-secondary">
              <span className="text-lg">
                {highlight === "Travel" ? "✈️" : highlight === "Food" ? "🍕" : highlight === "Art" ? "🎨" : "🗽"}
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground">{highlight}</span>
          </div>
        ))}
      </div> */}

      {showFlowing && ( 
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-background/95 flex flex-col items-center"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-3 font-semibold text-2xl">
                  Following
                </div>
                <button onClick={()=>setShowFlowing(false)}>
                  <div className="h-6 w-6 text-end text-foreground hover:text-primary transition-colors" >x</div>
                </button>
              </div>

              { usersfollowing.length > 0 ?
              <div className="mb-3 py-5 w-150 h-full">
                <div className="flex flex-col items-center gap-7 bg-secondary p-3 border-border border-1 rounded-2xl w-full h-full">
                  <div onScroll={handleFollowingScroll} className="flex flex-col gap-3 w-full h-full">
                      {usersfollowing.map((user: any)=>(
                          <Following user={user}/>
                      ))}
                  </div>
                </div>
              </div> :
              <div className="font-bold text-2xl">Fuck you, you fucking blind don't u see it say's 0</div>
            }
            </motion.div>
          </AnimatePresence>
      )}
      {showFlower &&(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/95 flex flex-col items-center"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-3 font-semibold text-2xl">
                Follower
              </div>
              <button onClick={()=>setShowFlower(false)}>
                <div className="h-6 w-6 text-end text-foreground hover:text-primary transition-colors" >x</div>
              </button>
            </div>
          <Followers followinglist={followerlist} userid={userid}/>
          </motion.div>
        </AnimatePresence>
      )}
      {(showsory && story) && (
        <div className='top-0 left-0 z-6 absolute flex justify-center items-center gap-2 backdrop-blur-sm w-full h-full'>
          <div className='py-10 h-full'><p onClick={()=>setShowsory(false)} className='flex justify-center items-center bg-red-500 p-1 rounded-md size-7 text-xl'>X</p></div>
          <StoryViewer routes='/nortoute' stories={story} />
        </div>
      )}
    </>
  )
}

export default ProfileData
