const express = require("express");

const {
  listBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");
const requireAdmin = require("../middleware/requireAdmin");
const uploadBlogImage = require("../middleware/uploadBlogImage");

const router = express.Router();

router
  .route("/")
  .get(listBlogs)
  .post(requireAdmin, uploadBlogImage.single("image"), createBlog);

router.get("/slug/:slug", getBlogBySlug);
router
  .route("/:id")
  .put(requireAdmin, uploadBlogImage.single("image"), updateBlog)
  .delete(requireAdmin, deleteBlog);

module.exports = router;
