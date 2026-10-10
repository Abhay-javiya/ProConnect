import { createSlice } from "@reduxjs/toolkit";
import { addPostComment, createPost, deletePost, fetchPosts, likePost } from "../../action/postAction";

const initialState = {
  items: [],
  isLoading: false,
  isError: false,
  message: "",
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    clearPostMessage: (state) => {
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || action.error.message || "Could not load posts.";
      })
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message || "Post created.";
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || action.error.message || "Could not create post.";
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.items = state.items.filter((post) => post._id !== action.payload.post_id);
        state.message = action.payload.message || "Post deleted.";
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload?.message || action.error.message || "Could not delete post.";
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const post = state.items.find((item) => item._id === action.payload.post_id);
        if (post) post.likes = (post.likes || 0) + 1;
      })
      .addCase(likePost.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload?.message || action.error.message || "Could not like post.";
      })
      .addCase(addPostComment.fulfilled, (state, action) => {
        state.message = action.payload.message || "Comment added.";
      })
      .addCase(addPostComment.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload?.message || action.error.message || "Could not add comment.";
      });
  },
});

export const { clearPostMessage } = postSlice.actions;
export default postSlice.reducer;
