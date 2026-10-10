import { createAsyncThunk } from "@reduxjs/toolkit";
import clientServer from "@/config";

const getError = (error, fallback) =>
  error.response?.data || { message: error.message || fallback };

export const fetchPosts = createAsyncThunk(
  "posts/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await clientServer.get("/posts");
      return data.posts || [];
    } catch (error) {
      return rejectWithValue(getError(error, "Could not load posts."));
    }
  }
);

export const createPost = createAsyncThunk(
  "posts/create",
  async ({ body, media, token }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("body", body);
      formData.append("token", token);
      if (media) formData.append("media", media);
      const { data } = await clientServer.post("/post", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } catch (error) {
      return rejectWithValue(getError(error, "Could not create post."));
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/delete",
  async ({ post_id, token }, { rejectWithValue }) => {
    try {
      const { data } = await clientServer.post("/delete_post", { post_id, token });
      return { post_id, ...data };
    } catch (error) {
      return rejectWithValue(getError(error, "Could not delete post."));
    }
  }
);

export const likePost = createAsyncThunk(
  "posts/like",
  async (post_id, { rejectWithValue }) => {
    try {
      const { data } = await clientServer.post("/increment_post_likes", { post_id });
      return { post_id, ...data };
    } catch (error) {
      return rejectWithValue(getError(error, "Could not like post."));
    }
  }
);

export const addPostComment = createAsyncThunk(
  "posts/addComment",
  async ({ token, postId, commentBody }, { rejectWithValue }) => {
    try {
      const { data } = await clientServer.post("/comment", { token, postId, commentBody });
      return { postId, ...data };
    } catch (error) {
      return rejectWithValue(getError(error, "Could not add comment."));
    }
  }
);
