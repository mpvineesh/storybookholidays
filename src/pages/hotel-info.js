import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../common/header';
import Footer from '../common/footer';
import Seo from '../common/Seo';
import { getHotelBySlug } from '../services/itineraryAdminApi';

const isPrerender = () =>
  typeof navigator !== 'undefined' && navigator.userAgent === 'ReactSnap';

const stripHtml = (value = '') => {
  if (!value) return '';
  if (typeof window !== 'undefined' && window.DOMParser) {
    const parsed = new window.DOMParser().parseFromString(value, 'text/html');
    return (parsed.body.textContent || '').replace(/\s+/g, ' ').trim();
  }
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
};

const formatPrice = (value) => {
  const amount = Number(value) || 0;
  if (!amount) return '';
  return `₹${amount.toLocaleString('en-IN')} per night`;
};

const normalizeUrl = (value = '') => {
  if (!value) return '';
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
};

function HotelInfo() {
  const { slug } = useParams();
  const [hotel, setHotel] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState('');

  React.useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setErrorMessage('');

    getHotelBySlug(slug)
      .then((response) => {
        if (!isMounted) return;
        setHotel(response.data || null);
      })
      .then(() => {
        if (isMounted) setIsLoading(false);
      })
      .catch((error) => {
        if (!isMounted) return;
        setHotel(null);
        // Keep the prerendered snapshot in its loading state; the browser
        // fetches the real data after hydration.
        if (isPrerender()) return;
        setErrorMessage(error.message || 'This stay could not be loaded.');
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const title = hotel?.name || 'Curated Stay';
  const description =
    hotel?.shortDescription ||
    stripHtml(hotel?.contentHtml || '').slice(0, 200) ||
    'A handpicked stay from Story Book Holidays.';
  const stars = Number(hotel?.starRating) || 0;
  const priceLabel = formatPrice(hotel?.priceFrom);
  const whatsappText = encodeURIComponent(
    `Hi Storybook Holidays, I'd like to enquire about staying at ${title}.`
  );

  return (
    <React.Fragment>
      <Seo
        title={title}
        description={description}
        path={`/hotel/${slug || ''}`}
        image={hotel?.imageUrl || undefined}
        type="article"
        jsonLd={
          hotel
            ? {
                '@context': 'https://schema.org',
                '@type': 'LodgingBusiness',
                name: hotel.name,
                description,
                image: hotel.imageUrl,
                address: hotel.address || hotel.location || undefined,
                telephone: hotel.contactPhone || undefined,
                url: `https://storybookholidays.com/hotel/${hotel.slug}`,
              }
            : undefined
        }
      />
      <Header parent={title} />
      <main className="content">
        <div className="fullwidth-block">
          <div className="container">
            <div className="row">
              <div className="col-md-12 wow fadeInLeft">
                {errorMessage ? <div className="admin-alert admin-alert-error">{errorMessage}</div> : null}
                {isLoading ? <p>Loading stay...</p> : null}

                {hotel ? (
                  <div className="package-detail-article hotel-detail">
                    <p className="package-detail-duration">
                      {[hotel.type, hotel.region].filter(Boolean).join(' · ')}
                    </p>
                    <h2 className="section-title">{hotel.name}</h2>

                    <div className="hotel-detail-meta">
                      {stars ? (
                        <span className="hotel-stars" aria-label={`${stars} star property`}>
                          {Array.from({ length: stars }).map((_, index) => (
                            <i key={index} className="fa fa-star" aria-hidden="true" />
                          ))}
                        </span>
                      ) : null}
                      {hotel.location ? (
                        <span className="hotel-location">
                          <i className="fa fa-map-marker" aria-hidden="true" /> {hotel.location}
                        </span>
                      ) : null}
                      {priceLabel ? (
                        <span className="hotel-price">
                          From {priceLabel}
                          {hotel.priceNote ? <small> · {hotel.priceNote}</small> : null}
                        </span>
                      ) : null}
                    </div>

                    {hotel.imageUrl ? (
                      <figure className="package-detail-cover">
                        <img src={hotel.imageUrl} alt={hotel.name} decoding="async" />
                      </figure>
                    ) : null}

                    {hotel.shortDescription ? (
                      <p className="package-detail-summary">{hotel.shortDescription}</p>
                    ) : null}

                    {hotel.amenities && hotel.amenities.length > 0 ? (
                      <div className="hotel-amenities">
                        <h3>Amenities</h3>
                        <ul>
                          {hotel.amenities.map((amenity) => (
                            <li key={amenity}>
                              <i className="fa fa-check" aria-hidden="true" /> {amenity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {hotel.contentHtml ? (
                      <div
                        className="package-detail-html"
                        dangerouslySetInnerHTML={{ __html: hotel.contentHtml }}
                      />
                    ) : null}

                    {hotel.gallery && hotel.gallery.length > 0 ? (
                      <div className="hotel-gallery">
                        <h3>Gallery</h3>
                        <div className="hotel-gallery-grid">
                          {hotel.gallery.map((entry, index) => (
                            <figure key={entry.imagePath || index}>
                              <img
                                src={entry.imageUrl}
                                alt={`${hotel.name} ${index + 1}`}
                                loading="lazy"
                                decoding="async"
                              />
                            </figure>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    <div className="hotel-enquiry">
                      <div className="hotel-enquiry-copy">
                        <h3>Plan your stay at {hotel.name}</h3>
                        <p>
                          Tell us your dates and we will check availability, share the best
                          rates, and weave this stay into your journey.
                        </p>
                        {hotel.address ? (
                          <p className="hotel-address">
                            <i className="fa fa-building-o" aria-hidden="true" /> {hotel.address}
                          </p>
                        ) : null}
                      </div>
                      <div className="hotel-enquiry-actions">
                        <a
                          href={`https://wa.me/919446460533?text=${whatsappText}`}
                          className="button"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="fa fa-whatsapp" aria-hidden="true" /> Enquire on WhatsApp
                        </a>
                        {hotel.contactPhone ? (
                          <a href={`tel:${hotel.contactPhone.replace(/\s+/g, '')}`} className="button button-outline">
                            <i className="fa fa-phone" aria-hidden="true" /> {hotel.contactPhone}
                          </a>
                        ) : null}
                        {hotel.contactEmail ? (
                          <a href={`mailto:${hotel.contactEmail}`} className="button button-outline">
                            <i className="fa fa-envelope-o" aria-hidden="true" /> Email
                          </a>
                        ) : null}
                        {hotel.website ? (
                          <a
                            href={normalizeUrl(hotel.website)}
                            className="button button-outline"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <i className="fa fa-globe" aria-hidden="true" /> Website
                          </a>
                        ) : null}
                        {hotel.mapUrl ? (
                          <a
                            href={normalizeUrl(hotel.mapUrl)}
                            className="button button-outline"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <i className="fa fa-map-o" aria-hidden="true" /> View on map
                          </a>
                        ) : null}
                      </div>
                    </div>

                    <p className="hotel-back-link">
                      <a href="/hotels">← Back to all stays</a>
                    </p>
                  </div>
                ) : null}

                {!isLoading && !hotel && !errorMessage ? (
                  <p>This stay could not be found. <a href="/hotels">Browse all stays</a>.</p>
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

export default HotelInfo;
