const { getStoredFileName, getStoredFileUrl } = require("./objectStorage");
const slugify = require("./slugify");

const mapBlogResponse = (req, blogDocument) => {
  const blogObject = blogDocument.toObject ? blogDocument.toObject() : blogDocument;

  return {
    ...blogObject,
    tags: Array.isArray(blogObject.tags) ? blogObject.tags : [],
    imageUrl: getStoredFileUrl(req, blogObject.imagePath),
    imageFileName: getStoredFileName(blogObject.imagePath),
  };
};

const parseTags = (value) => {
  if (Array.isArray(value)) {
    return value.map((tag) => String(tag).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
};

const parseBlogInput = (body = {}) => ({
  title: (body.title || "").trim(),
  slug: slugify(body.slug || body.title || ""),
  author: (body.author || "").trim() || "Story Book Holidays",
  excerpt: (body.excerpt || "").trim(),
  contentHtml: body.contentHtml || "",
  tags: parseTags(body.tags),
});

module.exports = {
  mapBlogResponse,
  parseBlogInput,
};
