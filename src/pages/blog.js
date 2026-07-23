import React from 'react';
import Header from '../common/header';
import Footer from '../common/footer';
import Seo from '../common/Seo';
import { getBlogs } from '../services/itineraryAdminApi';

const fallbackImages = [
  '/assets/images/slide7.jpg',
  '/assets/images/slide-kumarakam.jpg',
  '/assets/images/slide4.jpg',
  '/assets/images/slide-athirappally.jpg',
  '/assets/images/slide6.jpg',
  '/assets/images/slide3.jpg',
];

const stripHtml = (value = '') => {
  if (!value) return '';
  if (typeof window !== 'undefined' && window.DOMParser) {
    const parsed = new window.DOMParser().parseFromString(value, 'text/html');
    return (parsed.body.textContent || '').replace(/\s+/g, ' ').trim();
  }
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
};

const truncateText = (value, maxLength) => {
  if (!value || value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trimEnd()}...`;
};

const formatDate = (value) => {
  if (!value) return '';
  try {
    return new Date(value).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    return '';
  }
};

const getBlogImage = (blog, index) =>
  blog.imageUrl || fallbackImages[index % fallbackImages.length];

const getBlogSummary = (blog, maxLength = 160) =>
  truncateText(blog.excerpt || stripHtml(blog.contentHtml), maxLength);

function Blog() {
  const [blogs, setBlogs] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;

    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
        const response = await getBlogs();
        if (!isMounted) return;
        setBlogs(response.data || []);
      } catch (error) {
        if (isMounted) setBlogs([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchBlogs();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <React.Fragment>
      <Seo
        title="Blog — Travel Stories, Guides & Tips | Story Book Holidays"
        description="Travel stories, destination guides and holiday tips from Story Book Holidays — inspiration for your next journey across Kerala, India and beyond."
        path="/blog"
      />
      <Header parent="Blog" />
      <main className="content blog-page">
        <section className="blog-section">
          <div className="container">
            {isLoading ? (
              <div className="blog-grid">
                {[0, 1, 2].map((item) => (
                  <article className="blog-card blog-card-loading" key={item}>
                    <div className="blog-card-media" />
                    <div className="blog-card-body">
                      <span className="blog-loading-line short" />
                      <span className="blog-loading-line" />
                      <span className="blog-loading-line" />
                      <span className="blog-loading-line medium" />
                    </div>
                  </article>
                ))}
              </div>
            ) : null}

            {!isLoading && blogs.length > 0 ? (
              <div className="blog-grid">
                {blogs.map((blog, index) => (
                  <article className="blog-card" key={blog._id || blog.slug}>
                    <a className="blog-card-media-link" href={`/blog/${blog.slug}`}>
                      <div
                        className="blog-card-media"
                        style={{ backgroundImage: `url('${getBlogImage(blog, index)}')` }}
                      />
                    </a>
                    <div className="blog-card-body">
                      <p className="blog-card-meta">
                        {[blog.author, formatDate(blog.createdAt)].filter(Boolean).join(' · ')}
                      </p>
                      <h3>
                        <a href={`/blog/${blog.slug}`}>{blog.title}</a>
                      </h3>
                      <p className="blog-card-excerpt">{getBlogSummary(blog)}</p>
                      {blog.tags && blog.tags.length ? (
                        <div className="blog-card-tags">
                          {blog.tags.slice(0, 3).map((tag) => (
                            <span className="blog-tag" key={tag}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : null}
                      <a className="blog-card-link" href={`/blog/${blog.slug}`}>
                        Read more
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            ) : null}

            {!isLoading && !blogs.length ? (
              <div className="blog-empty-state">
                <p className="section-kicker">No blog posts yet</p>
                <h2 className="section-title">Stories are on the way.</h2>
                <p>Check back soon for travel stories, guides and holiday inspiration.</p>
              </div>
            ) : null}
          </div>
        </section>
      </main>
      <Footer />
    </React.Fragment>
  );
}

export default Blog;
