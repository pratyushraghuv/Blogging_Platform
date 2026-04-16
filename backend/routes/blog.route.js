import express from "express";

import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

import {
  createBlog,
  deleteBlog,
  dislikeBlog,
  getAllBlogs,
  getMyTotalBlogLikes,
  getOwnBlogs,
  getPublishedBlog,
  likeBlog,
  togglePublishBlog,
  updateBlog
} from "../controllers/blog.controller.js";

const router = express.Router();

// CREATE BLOG
router.post("/", createBlog);

// UPDATE BLOG
router.put("/:blogId", updateBlog);

// TOGGLE PUBLISH
router.patch("/:blogId", togglePublishBlog);

// GET BLOGS
router.get("/get-all-blogs", getAllBlogs);
router.get("/get-published-blogs", getPublishedBlog);
router.get("/get-own-blogs", getOwnBlogs);

// DELETE BLOG
router.delete("/delete/:id", deleteBlog);

// LIKE / DISLIKE
router.get("/:id/liked", likeBlog);
router.get("/:id/dislike", dislikeBlog);

// TOTAL LIKES
router.get("/my-blogs/likes", getMyTotalBlogLikes);

export default router;