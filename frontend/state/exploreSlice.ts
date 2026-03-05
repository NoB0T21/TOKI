import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Posts } from "@/Types/types";

interface ExploreState {
  posts: Posts[];
  skip: number;
  hasMore: boolean;
  scrollPosition: number;
}

const initialState: ExploreState = {
  posts: [],
  skip: 1,
  hasMore: true,
  scrollPosition: 0,
};

const exploreSlice = createSlice({
  name: "explore",
  initialState,
  reducers: {
    addPosts: (state, action: PayloadAction<Posts[]>) => {
      const merged = [...state.posts, ...action.payload];

      const unique = Array.from(
        new Map(merged.map((p) => [p.id, p])).values()
      );

      state.posts = unique;

      if (action.payload.length < 16) {
        state.hasMore = false;
      }
    },

    setScrollPosition: (state, action: PayloadAction<number>) => {
      state.scrollPosition = action.payload;
    },

    increaseSkip: (state) => {
      state.skip += 1;
    },

    resetSkip: (state) => {
      state.skip = 0;
    },
  },
});

export const { addPosts, increaseSkip, setScrollPosition, resetSkip } = exploreSlice.actions;
export default exploreSlice.reducer;
