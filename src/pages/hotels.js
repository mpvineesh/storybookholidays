import React from 'react';
import Header from '../common/header';
import Footer from '../common/footer';
import Seo from '../common/Seo';
import { getHotels } from '../services/itineraryAdminApi';

// react-snap blocks cross-origin API calls while prerendering. Keep the static
// snapshot in the loading state so visitors never see a stale "coming soon".
const isPrerender = () =>
  typeof navigator !== 'undefined' && navigator.userAgent === 'ReactSnap';

const renderStars = (count) => {
  const stars = Number(count) || 0;
  if (!stars) return null;
  return (
    <span className="hotel-stars" aria-label={`${stars} star property`}>
      {Array.from({ length: stars }).map((_, index) => (
        <i key={index} className="fa fa-star" aria-hidden="true" />
      ))}
    </span>
  );
};

const formatPrice = (value) => {
  const amount = Number(value) || 0;
  if (!amount) return '';
  return `From ₹${amount.toLocaleString('en-IN')} / night`;
};

function ComingSoonSection() {
  return (
    <section
      className="hotels-coming-soon"
      style={{ backgroundImage: "url('/assets/images/slide-athirappally.jpg')" }}
    >
      <div className="hotels-coming-soon-overlay" />
      <div className="container">
        <div className="hotels-coming-soon-card">
          <span className="hotels-coming-soon-eyebrow">Stays with a story</span>
          <h2>Curated Stays are coming soon.</h2>
          <p>
            We are handpicking boutique hotels, lakeside resorts, heritage homestays,
            and houseboats that fit the journeys we design. Until the collection
            goes live, our team is happy to recommend and book the right stay for you.
          </p>
          <div className="hotels-coming-soon-actions">
            <a
              href="https://wa.me/919446460533?text=Hi%20Storybook%20Holidays%2C%20I%27d%20like%20help%20choosing%20a%20hotel%20or%20resort."
              className="button"
              target="_blank"
              rel="noreferrer"
            >
              Ask us on WhatsApp
            </a>
            <a href="/packages" className="button button-outline">
              Explore our journeys
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Hotels() {
  const [hotels, setHotels] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadFailed, setLoadFailed] = React.useState(false);
  const [regionFilter, setRegionFilter] = React.useState('All');
  const [typeFilter, setTypeFilter] = React.useState('All');

  React.useEffect(() => {
    let isMounted = true;

    getHotels()
      .then((response) => {
        if (!isMounted) return;
        setHotels(response.data || []);
      })
      .then(() => {
        if (isMounted) setIsLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setHotels([]);
        setLoadFailed(true);
        if (!isPrerender()) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const regions = React.useMemo(
    () => Array.from(new Set(hotels.map((hotel) => hotel.region).filter(Boolean))),
    [hotels]
  );
  const types = React.useMemo(
    () => Array.from(new Set(hotels.map((hotel) => hotel.type).filter(Boolean))),
    [hotels]
  );

  const filtered = React.useMemo(
    () =>
      hotels.filter(
        (hotel) =>
          (regionFilter === 'All' || hotel.region === regionFilter) &&
          (typeFilter === 'All' || hotel.type === typeFilter)
      ),
    [hotels, regionFilter, typeFilter]
  );

  const showComingSoon = !isLoading && !loadFailed && hotels.length === 0;

  return (
    <React.Fragment>
      <Seo
        title="Curated Stays — Hotels, Resorts & Homestays"
        description="Handpicked hotels, resorts, homestays, and houseboats chosen by Story Book Holidays to match the journeys we design across Kerala and India."
        path="/hotels"
      />
      <Header parent="Curated Stays" />
      <main className="content packages-page hotels-page">
        {showComingSoon ? (
          <ComingSoonSection />
        ) : (
          <section className="packages-section">
            <div className="container">
              <div className="hotels-intro">
                <span className="hotels-eyebrow">Stays with a story</span>
                <h2 className="section-title">Curated Stays</h2>
                <p>
                  Boutique hotels, lakeside resorts, heritage homestays, and houseboats we
                  trust, handpicked to fit the journeys we design.
                </p>
              </div>

              {!isLoading && (regions.length > 1 || types.length > 1) ? (
                <div className="hotels-filters">
                  {regions.length > 1 ? (
                    <div className="hotels-filter-group" role="group" aria-label="Filter by region">
                      <button
                        type="button"
                        className={`hotels-filter-chip ${regionFilter === 'All' ? 'is-active' : ''}`}
                        onClick={() => setRegionFilter('All')}
                      >
                        All regions
                      </button>
                      {regions.map((region) => (
                        <button
                          key={region}
                          type="button"
                          className={`hotels-filter-chip ${regionFilter === region ? 'is-active' : ''}`}
                          onClick={() => setRegionFilter(region)}
                        >
                          {region}
                        </button>
                      ))}
                    </div>
                  ) : null}
                  {types.length > 1 ? (
                    <div className="hotels-filter-group" role="group" aria-label="Filter by type">
                      <button
                        type="button"
                        className={`hotels-filter-chip ${typeFilter === 'All' ? 'is-active' : ''}`}
                        onClick={() => setTypeFilter('All')}
                      >
                        All types
                      </button>
                      {types.map((type) => (
                        <button
                          key={type}
                          type="button"
                          className={`hotels-filter-chip ${typeFilter === type ? 'is-active' : ''}`}
                          onClick={() => setTypeFilter(type)}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}

              {isLoading ? <p className="packages-empty">Loading stays...</p> : null}
              {!isLoading && loadFailed ? (
                <p className="packages-empty">
                  Our stays are temporarily unavailable. Please try again shortly or reach
                  us on WhatsApp.
                </p>
              ) : null}
              {!isLoading && !loadFailed && filtered.length === 0 ? (
                <p className="packages-empty">No stays match the selected filters.</p>
              ) : null}

              <div className="packages-grid">
                {filtered.map((hotel) => (
                  <article key={hotel._id || hotel.slug} className="offer-item package-card hotel-card">
                    <figure className="featured-image">
                      <a href={`/hotel/${hotel.slug}`}>
                        <img
                          src={hotel.imageUrl || '/assets/images/slide-athirappally.jpg'}
                          height="300"
                          className="package-image"
                          alt={hotel.name}
                          loading="lazy"
                          decoding="async"
                        />
                      </a>
                      <span className="hotel-type-badge">{hotel.type || 'Hotel'}</span>
                    </figure>
                    <div className="package-card-body">
                      <div className="hotel-card-meta">
                        {renderStars(hotel.starRating)}
                        {hotel.location ? (
                          <span className="hotel-location">
                            <i className="fa fa-map-marker" aria-hidden="true" /> {hotel.location}
                          </span>
                        ) : null}
                      </div>
                      <h2 className="entry-title">
                        <a href={`/hotel/${hotel.slug}`}>{hotel.name}</a>
                      </h2>
                      {hotel.shortDescription ? <p>{hotel.shortDescription}</p> : null}
                    </div>
                    <div className="price">
                      <small>{formatPrice(hotel.priceFrom) || hotel.region || 'Enquire for rates'}</small>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </React.Fragment>
  );
}

export default Hotels;
