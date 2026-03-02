import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/Types/types";

interface FeedState {
  userprofileFollowing: any[];
  skip: number;
  hasMore: boolean;
}

const initialState: FeedState = {
  userprofileFollowing: [],
  skip: 1,
  hasMore: true,
};

const userProfileFollowersSlice = createSlice({
  name: "userProfileFollowers",
  initialState,
  reducers: {
    adduserProfileFollowers: (state, action: PayloadAction<User[] | undefined>) => {
      if (!Array.isArray(action.payload)) return;
      const unique = new Map(
        [...state.userprofileFollowing, ...action.payload]
          .map(user => [user._id, user])
      );

      state.userprofileFollowing = Array.from(unique.values());

      state.hasMore = action.payload.length >= 14;
    },

    increaseSkipofuserProfileFollowers: (state) => {
      state.skip += 1;
    },
    resetFeed: () => initialState
  },
});

export const { adduserProfileFollowers, increaseSkipofuserProfileFollowers, resetFeed } = userProfileFollowersSlice.actions;
export default userProfileFollowersSlice.reducer;
