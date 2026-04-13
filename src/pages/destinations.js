import React from 'react';
import Header from '../common/header';
import Footer from '../common/footer';
import { getDestinations } from '../services/itineraryAdminApi';

const fallbackImages = [
  '/assets/images/slide7.jpg',
  '/assets/images/slide-kumarakam.jpg',
  '/assets/images/slide4.jpg',
  '/assets/images/slide-athirappally.jpg',
  '/assets/images/slide6.jpg',
  '/assets/images/slide3.jpg',
];

const stripHtml = (value = '') => {
  if (!value) {
    return '';
  }

  if (typeof window !== 'undefined' && window.DOMParser) {
    const parsedDocument = new window.DOMParser().parseFromString(value, 'text/html');
    return (parsedDocument.body.textContent || '').replace(/\s+/g, ' ').trim();
  }

  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
};

const truncateText = (value, maxLength) => {
  if (!value || value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trimEnd()}...`;
};

const createDestinationId = (destination) =>
  destination.slug ||
  destination._id ||
  (destination.title || 'destination')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const getDestinationImage = (destination, index) =>
  destination.imageUrl || fallbackImages[index % fallbackImages.length];

const getDestinationSummary = (destination, maxLength = 180) =>
  truncateText(destination.shortDescription || stripHtml(destination.contentHtml), maxLength);

const getReadingTime = (destination) => {
  const text = stripHtml(destination.contentHtml);
  const words = text ? text.split(/\s+/).filter(Boolean).length : 0;

  return Math.max(1, Math.round(words / 180));
};

function Destinations() {
  const [destinations, setDestinations] = React.useState([]);
  const [selectedDestinationId, setSelectedDestinationId] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState('');

  React.useEffect(() => {
    let isMounted = true;

    const fetchDestinations = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await getDestinations();

        if (!isMounted) {
          return;
        }

        setDestinations(response.data || []);
      } catch (error) {
        if (isMounted) {
          setDestinations([]);
          setErrorMessage(error.message || 'Unable to load destinations right now.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchDestinations();

    return () => {
      isMounted = false;
    };
  }, []);

  React.useEffect(() => {
    if (!destinations.length) {
      setSelectedDestinationId('');
      return;
    }

    const availableIds = destinations.map((destination) => createDestinationId(destination));
    const currentHash =
      typeof window !== 'undefined' ? decodeURIComponent(window.location.hash.replace(/^#/, '')) : '';

    if (currentHash && availableIds.includes(currentHash)) {
      setSelectedDestinationId(currentHash);
      return;
    }

    if (!selectedDestinationId || !availableIds.includes(selectedDestinationId)) {
      setSelectedDestinationId(availableIds[0]);
    }
  }, [destinations, selectedDestinationId]);

  React.useEffect(() => {
    if (typeof window === 'undefined' || !destinations.length) {
      return undefined;
    }

    const handleHashChange = () => {
      const hash = decodeURIComponent(window.location.hash.replace(/^#/, ''));

      if (!hash) {
        return;
      }

      const matchedDestination = destinations.find(
        (destination) => createDestinationId(destination) === hash
      );

      if (matchedDestination) {
        setSelectedDestinationId(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [destinations]);

  const scrollToDestinationArticle = (destinationId) => {
    if (typeof window === 'undefined') {
      return;
    }

    window.requestAnimationFrame(() => {
      const articleElement = document.getElementById(destinationId);

      if (articleElement) {
        articleElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  };

  const handleSelectDestination = (destinationId, options = {}) => {
    const { scrollToArticle = false } = options;

    setSelectedDestinationId(destinationId);

    if (typeof window !== 'undefined') {
      const nextUrl = `${window.location.pathname}${window.location.search}#${destinationId}`;
      window.history.replaceState(null, '', nextUrl);
    }

    if (scrollToArticle) {
      scrollToDestinationArticle(destinationId);
    }
  };

  const featuredDestination =
    destinations.find((destination) => createDestinationId(destination) === selectedDestinationId) ||
    destinations[0] ||
    null;

  return (
    <React.Fragment>
      <Header parent="Destinations" />
      <main className="content destinations-page">
       
        <section className="destinations-browser">
          <div className="container">
          

            {isLoading ? (
              <div className="destination-browser-grid">
                {[0, 1, 2].map((item) => (
                  <article className="destination-browser-card destination-browser-card-loading" key={item}>
                    <div className="destination-browser-card-media" />
                    <div className="destination-browser-card-body">
                      <span className="destination-loading-line short" />
                      <span className="destination-loading-line" />
                      <span className="destination-loading-line" />
                      <span className="destination-loading-line medium" />
                    </div>
                  </article>
                ))}
              </div>
            ) : null}

            {!isLoading && destinations.length > 0 ? (
              <React.Fragment>
                <div className="destination-browser-grid">
                  {destinations.map((destination, index) => {
                    const destinationId = createDestinationId(destination);
                    const isActive = destinationId === createDestinationId(featuredDestination || {});

                    return (
                      <article
                        className={`destination-browser-card ${isActive ? 'is-active' : ''}`}
                        key={destination._id || destinationId}
                      >
                        <div
                          className="destination-browser-card-media"
                          style={{ backgroundImage: `url('${getDestinationImage(destination, index)}')` }}
                        />
                        <div className="destination-browser-card-body">
                          <p className="destination-browser-card-meta">Destination {index + 1}</p>
                          <h3>{destination.title}</h3>
                          <p>{getDestinationSummary(destination, 125)}</p>
                          <div className="destination-browser-card-actions">
                            <button
                              type="button"
                              className="button destination-browser-action"
                              onClick={() => handleSelectDestination(destinationId)}
                            >
                              Spotlight
                            </button>
                            <a
                              className="destination-browser-link"
                              href={`#${destinationId}`}
                              onClick={(event) => {
                                event.preventDefault();
                                handleSelectDestination(destinationId, { scrollToArticle: true });
                              }}
                            >
                              Read guide
                            </a>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <div className="destination-content-layout">
                  <div className="destination-articles">
                    {destinations.map((destination, index) => {
                      const destinationId = createDestinationId(destination);
                      const isActive = destinationId === createDestinationId(featuredDestination || {});

                      return (
                        <article
                          className={`destination-article ${isActive ? 'is-active' : ''}`}
                          id={destinationId}
                          key={destination._id || destinationId}
                        >
                          <div className="destination-article-media">
                            <img
                              src={getDestinationImage(destination, index)}
                              alt={destination.title}
                              loading="lazy"
                            />
                          </div>
                          <div className="destination-article-body">
                            <div className="destination-article-header">
                              <span className="destination-article-index">Stop {index + 1}</span>
                              <h2>{destination.title}</h2>
                              <div className="destination-article-meta">
                                <span>{getReadingTime(destination)} min read</span>
                                <span>{destination.slug || destinationId}</span>
                              </div>
                            </div>

                            {destination.shortDescription ? (
                              <p className="destination-article-summary">{destination.shortDescription}</p>
                            ) : null}

                            <div
                              className="destination-article-html"
                              dangerouslySetInnerHTML={{ __html: destination.contentHtml }}
                            />
                          </div>
                        </article>
                      );
                    })}
                  </div>

                  <aside className="destination-sidebar">
                    <div className="destination-sidebar-card">
                      <p className="destination-sidebar-label">On this page</p>
                      <h3>Jump between destinations</h3>
                      <ul>
                        {destinations.map((destination) => {
                          const destinationId = createDestinationId(destination);
                          const isActive = destinationId === createDestinationId(featuredDestination || {});

                          return (
                            <li key={destination._id || destinationId}>
                              <a
                                className={isActive ? 'is-active' : ''}
                                href={`#${destinationId}`}
                                onClick={(event) => {
                                  event.preventDefault();
                                  handleSelectDestination(destinationId, { scrollToArticle: true });
                                }}
                              >
                                {destination.title}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </aside>
                </div>
              </React.Fragment>
            ) : null}

            {!isLoading && !destinations.length ? (
              <div className="destinations-empty-state">
                <p className="section-kicker">No destinations yet</p>
                <h2 className="section-title">Publish destination items to fill this screen.</h2>
                <p>
                  This page is ready for multiple API-backed destinations, including spotlight,
                  browse cards, and long-form destination content.
                </p>
              </div>
            ) : null}
          </div>
        </section>
        </main>
      <Footer />
    </React.Fragment>
  );
}

export default Destinations;
