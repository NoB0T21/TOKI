import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/Types/types";

interface FeedState {
  profileFollowers: any[];
  skip: number;
  hasMore: boolean;
}

const initialState: FeedState = {
  profileFollowers: [],
  skip: 1,
  hasMore: true,
};

const profileFollowersSlice = createSlice({
  name: "profileFollowers",
  initialState,
  reducers: {
    addPosts: (state, action: PayloadAction<User[] | undefined>) => {
      if (!Array.isArray(action.payload)) return;
      const unique = new Map(
        [...state.profileFollowers, ...action.payload]
          .map(user => [user._id, user])
      );

      state.profileFollowers = Array.from(unique.values());

      state.hasMore = action.payload.length >= 14;
    },

    removeUserById: (state, action: PayloadAction<string>) => {
      state.profileFollowers = state.profileFollowers.filter(
        user => user._id !== action.payload
      );
    },

    increaseSkip: (state) => {
      state.skip += 1;
    },
    resetFeed: () => initialState
  },
});

export const { addPosts, increaseSkip, resetFeed, removeUserById } = profileFollowersSlice.actions;
export default profileFollowersSlice.reducer;
