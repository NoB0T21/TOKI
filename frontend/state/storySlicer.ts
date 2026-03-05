import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Posts2, Story } from "@/Types/types";

interface FeedState {
  posts: Story[];
}

const initialState: FeedState = {
  posts: [],
};

const storySlice = createSlice({
  name: "story",
  initialState,
  reducers: {
    addstory: (state, action: PayloadAction<Story[]>) => {
      const merged = [...state.posts, ...action.payload];

      const unique = Array.from(
        new Map(merged.map((p) => [p.id, p])).values()
      );

      state.posts = unique;
    },

    resetFeed: () => initialState
  },
});

export const { addstory, resetFeed } = storySlice.actions;
export default storySlice.reducer;
