const express = require("express");
const Router = express.Router();
const upload = require("../middlewares/imageUploader");
const {
  data,
  profile,
  posts,
  serachQuery,
  postID,
  post_likeID,
  post_UnlikeId,
  post_CommentId,
  createBlog,
  editBlog,
  deleteBlog,
} = require("../controllers/user.controller");

Router.post("/data", data);

//profile of the particular user......................
Router.post("/profile", profile);

//all blogs displayed........
Router.get("/posts", posts);

//search blog............
Router.get("/search/:query", serachQuery);

//particular bolg is displayed here when user clicks on that blog...........
Router.get("/post/:id", postID);

//liked the particular blog...............
Router.post("/post/like/:id", post_likeID);

//unliked the particular blog...............
Router.post("/post/unlike/:id", post_UnlikeId);

//commented on the particular blog...............
Router.post("/post/comment/:id", post_CommentId);

//create blog...........................
Router.post("/create", upload.single("image"), createBlog);

//edit the blog..........................
Router.post("/edit", upload.single("image"), editBlog);

//delete the blog...................
Router.post("/delete", upload.single("image"), deleteBlog);

module.exports = Router;
