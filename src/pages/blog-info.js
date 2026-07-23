import React from 'react';
import Header from '../common/header';
import Footer from '../common/footer';
import Seo from '../common/Seo';
import { useParams } from 'react-router-dom';

import { getBlogBySlug } from '../services/itineraryAdminApi';

const stripHtml = (value = '') => {
  if (!value) return '';
  if (typeof window !== 'undefined' && window.DOMParser) {
    const parsed = new window.DOMParser().parseFromString(value, 'text/html');
    return (parsed.body.textContent || '').replace(/\s+/g, ' ').trim();
  }
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
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

function BlogInfo() {
  const { slug } = useParams();
  const [blog, setBlog] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState('');

  React.useEffect(() => {
    if (!slug) {
      setIsLoading(false);
      return undefined;
    }

    let isMounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await getBlogBySlug(slug);
        if (!isMounted) return;
        setBlog(response.data || null);
      } catch (error) {
        if (!isMounted) return;
        setBlog(null);
        const isPrerender =
          typeof navigator !== 'undefined' && navigator.userAgent === 'ReactSnap';
        if (!isPrerender) {
          setErrorMessage(error.message || 'Unable to load this blog post right now.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const seoTitle = blog?.title || 'Blog';
  const seoDescription =
    blog?.excerpt ||
    stripHtml(blog?.contentHtml || '').slice(0, 200) ||
    'Travel stories and guides by Story Book Holidays.';
  const seoImage = blog?.imageUrl || undefined;
  const publishedDate = formatDate(blog?.createdAt);

  return (
    <React.Fragment>
      <Seo
        title={seoTitle}
        description={seoDescription}
        path={`/blog/${slug || ''}`}
        image={seoImage}
        type="article"
        jsonLd={
          blog
            ? {
                '@context': 'https://schema.org',
                '@type': 'BlogPosting',
                headline: blog.title,
                description: seoDescription,
                image: blog.imageUrl,
                author: {
                  '@type': 'Organization',
                  name: blog.author || 'Story Book Holidays',
                },
                datePublished: blog.createdAt,
                dateModified: blog.updatedAt,
                url: `https://storybookholidays.com/blog/${slug}`,
              }
            : undefined
        }
      />
      <Header parent={blog?.title || 'Blog'} />
      <main className="content">
        <div className="fullwidth-block">
          <div className="container">
            <div className="row">
              <div className="col-md-12 wow fadeInLeft">
                {errorMessage ? (
                  <div className="admin-alert admin-alert-error">{errorMessage}</div>
                ) : null}
                {isLoading ? <p>Loading blog post...</p> : null}

                {blog ? (
                  <article className="package-detail-article">
                    <h2 className="section-title">{blog.title}</h2>
                    {blog.author || publishedDate ? (
                      <p className="blog-detail-meta">
                        {[blog.author, publishedDate].filter(Boolean).join(' · ')}
                      </p>
                    ) : null}
                    {blog.imageUrl ? (
                      <figure className="package-detail-cover">
                        <img
                          src={blog.imageUrl}
                          alt={blog.title}
                          loading="lazy"
                          decoding="async"
                        />
                      </figure>
                    ) : null}
                    {blog.excerpt ? (
                      <p className="package-detail-summary">{blog.excerpt}</p>
                    ) : null}
                    <div
                      className="package-detail-html"
                      dangerouslySetInnerHTML={{ __html: blog.contentHtml }}
                    />
                    {blog.tags && blog.tags.length ? (
                      <div className="blog-detail-tags">
                        {blog.tags.map((tag) => (
                          <span className="blog-tag" key={tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <p className="blog-detail-back">
                      <a href="/blog">← Back to all posts</a>
                    </p>
                  </article>
                ) : null}

                {!isLoading && !blog && !errorMessage ? (
                  <p>This blog post could not be found.</p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </React.Fragment>
  );
}

export default BlogInfo;
