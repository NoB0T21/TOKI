import { configureStore } from "@reduxjs/toolkit";
import feedReducer from "../state/feedSlice";
import exploreReducer from "../state/exploreSlice";
import profileFollowersReducer from "../state/profileFollowers";
import profileFollowingReducer from "../state/profileFollowing";
import userProfilefollowingsReducer from "../state/userProfilefollowings";
import userProfileFollowersReducer from "../state/userProfileFollowers";

export const store = configureStore({
  reducer: {
    feed: feedReducer,
    explore: exploreReducer,
    profileFollowers: profileFollowersReducer,
    profileFollowing: profileFollowingReducer,
    userProfilefollowings: userProfilefollowingsReducer,
    userProfileFollowers: userProfileFollowersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
