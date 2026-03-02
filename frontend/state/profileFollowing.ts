import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/Types/types";

interface FeedState {
  profileFollowing: any[];
  skip: number;
  hasMore: boolean;
}

const initialState: FeedState = {
  profileFollowing: [],
  skip: 1,
  hasMore: true,
};

const profileFollowersSlice = createSlice({
  name: "profileFollowing",
  initialState,
  reducers: {
    addprofileFollowing: (state, action: PayloadAction<User[] | undefined>) => {
      if (!Array.isArray(action.payload)) return;
      const unique = new Map(
        [...state.profileFollowing, ...action.payload]
          .map(user => [user._id, user])
      );

      state.profileFollowing = Array.from(unique.values());

      state.hasMore = action.payload.length >= 14;
    },

    increaseSkipofprofile: (state) => {
      state.skip += 1;
    },
    resetFeed: () => initialState
  },
});

export const { addprofileFollowing, increaseSkipofprofile, resetFeed } = profileFollowersSlice.actions;
export default profileFollowersSlice.reducer;
