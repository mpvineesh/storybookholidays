import React from 'react';
import Header from '../common/header';
import Footer from '../common/footer';
import Seo from '../common/Seo';
import { useParams } from 'react-router-dom';

import { getDestinationBySlug } from '../services/itineraryAdminApi';

const stripHtml = (value = '') => {
  if (!value) return '';
  if (typeof window !== 'undefined' && window.DOMParser) {
    const parsed = new window.DOMParser().parseFromString(value, 'text/html');
    return (parsed.body.textContent || '').replace(/\s+/g, ' ').trim();
  }
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
};

function DestinationInfo() {
  const { slug } = useParams();
  const [destination, setDestination] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState('');

  React.useEffect(() => {
    if (!slug) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await getDestinationBySlug(slug);
        if (!isMounted) return;
        setDestination(response.data || null);
      } catch (error) {
        if (!isMounted) return;
        setDestination(null);
        setErrorMessage(error.message || 'Unable to load this destination right now.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const seoTitle = destination?.title || 'Destination';
  const seoDescription =
    destination?.shortDescription ||
    stripHtml(destination?.contentHtml || '').slice(0, 200) ||
    'Curated destination guide by Story Book Holidays.';
  const seoImage = destination?.imageUrl || undefined;

  return (
    <React.Fragment>
      <Seo
        title={seoTitle}
        description={seoDescription}
        path={`/destination/${slug || ''}`}
        image={seoImage}
        type="article"
        jsonLd={
          destination
            ? {
                '@context': 'https://schema.org',
                '@type': 'TouristAttraction',
                name: destination.title,
                description: seoDescription,
                image: destination.imageUrl,
                url: `https://storybookholidays.com/destination/${slug}`,
              }
            : undefined
        }
      />
      <Header parent={destination?.title || 'Destination'} />
      <main className="content">
        <div className="fullwidth-block">
          <div className="container">
            <div className="row">
              <div className="col-md-12 wow fadeInLeft">
                {errorMessage ? (
                  <div className="admin-alert admin-alert-error">{errorMessage}</div>
                ) : null}
                {isLoading ? <p>Loading destination...</p> : null}

                {destination ? (
                  <div className="package-detail-article">
                    <h2 className="section-title">{destination.title}</h2>
                    {destination.imageUrl ? (
                      <figure className="package-detail-cover">
                        <img
                          src={destination.imageUrl}
                          alt={destination.title}
                          loading="lazy"
                          decoding="async"
                        />
                      </figure>
                    ) : null}
                    {destination.shortDescription ? (
                      <p className="package-detail-summary">{destination.shortDescription}</p>
                    ) : null}
                    <div
                      className="package-detail-html"
                      dangerouslySetInnerHTML={{ __html: destination.contentHtml }}
                    />
                  </div>
                ) : null}

                {!isLoading && !destination && !errorMessage ? (
                  <p>This destination could not be found.</p>
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

export default DestinationInfo;
