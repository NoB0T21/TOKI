import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Posts2 } from "@/Types/types";

interface FeedState {
  posts: Posts2[];
  skip: number;
  hasMore: boolean;
  scrollPosition: number;
}

const initialState: FeedState = {
  posts: [],
  skip: 0,
  hasMore: true,
  scrollPosition: 0,
};

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    addPosts: (state, action: PayloadAction<Posts2[]>) => {
      const merged = [...state.posts, ...action.payload];

      const unique = Array.from(
        new Map(merged.map((p) => [p.id, p])).values()
      );

      state.posts = unique;

      if (action.payload.length < 10) {
        state.hasMore = false;
      }
    },

    setScrollPosition: (state, action: PayloadAction<number>) => {
      state.scrollPosition = action.payload;
    },

    increaseSkip: (state) => {
      state.skip += 1;
    },
    resetFeed: () => initialState
  },
});

export const { addPosts, increaseSkip, setScrollPosition, resetFeed } = feedSlice.actions;
export default feedSlice.reducer;
