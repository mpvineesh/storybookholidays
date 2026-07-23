const Blog = require("../models/Blog");
const { removeStoredFile, uploadBufferToS3 } = require("../utils/objectStorage");
const { mapBlogResponse, parseBlogInput } = require("../utils/blogPayload");

const createUniqueSlug = async (baseSlug, existingId = null) => {
  const slugRoot = baseSlug || `blog-${Date.now()}`;
  let candidate = slugRoot;
  let counter = 1;

  while (true) {
    const existingBlog = await Blog.findOne({
      slug: candidate,
      ...(existingId ? { _id: { $ne: existingId } } : {}),
    });

    if (!existingBlog) {
      return candidate;
    }

    counter += 1;
    candidate = `${slugRoot}-${counter}`;
  }
};

const listBlogs = async (req, res, next) => {
  try {
    const filter = {};
    const { tag } = req.query;

    if (tag) {
      filter.tags = tag;
    }

    const blogs = await Blog.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs.map((entry) => mapBlogResponse(req, entry)),
    });
  } catch (error) {
    return next(error);
  }
};

const getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: mapBlogResponse(req, blog),
    });
  } catch (error) {
    return next(error);
  }
};

const createBlog = async (req, res, next) => {
  let uploadedImagePath = "";

  try {
    const blogInput = parseBlogInput(req.body);
    blogInput.slug = await createUniqueSlug(blogInput.slug);

    if (req.file) {
      uploadedImagePath = await uploadBufferToS3(req.file, "blogs", "blog");
      blogInput.imagePath = uploadedImagePath;
      blogInput.imageOriginalName = req.file.originalname;
    }

    const blog = await Blog.create(blogInput);

    return res.status(201).json({
      success: true,
      data: mapBlogResponse(req, blog),
    });
  } catch (error) {
    if (uploadedImagePath) {
      await removeStoredFile(uploadedImagePath);
    }

    return next(error);
  }
};

const updateBlog = async (req, res, next) => {
  let uploadedImagePath = "";

  try {
    const existingBlog = await Blog.findById(req.params.id);

    if (!existingBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const blogInput = parseBlogInput(req.body);
    blogInput.slug = await createUniqueSlug(
      blogInput.slug || existingBlog.slug,
      existingBlog._id
    );

    if (req.file) {
      uploadedImagePath = await uploadBufferToS3(req.file, "blogs", "blog");
      blogInput.imagePath = uploadedImagePath;
      blogInput.imageOriginalName = req.file.originalname;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blogInput, {
      returnDocument: "after",
      runValidators: true,
    });

    if (req.file && existingBlog.imagePath) {
      await removeStoredFile(existingBlog.imagePath);
    }

    return res.status(200).json({
      success: true,
      data: mapBlogResponse(req, updatedBlog),
    });
  } catch (error) {
    if (uploadedImagePath) {
      await removeStoredFile(uploadedImagePath);
    }

    return next(error);
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    if (blog.imagePath) {
      await removeStoredFile(blog.imagePath);
    }

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
};
