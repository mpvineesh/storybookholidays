import React from "react";
import Seo from "../common/Seo";
import { setStoredRegion } from "../context/regionStorage";
import { getRegions } from "../services/regionsApi";
import ContactModal from "../components/ContactModal";

const fallbackRegions = [
  {
    key: "kerala",
    label: "Kerala",
    tagline: "God's Own Country",
    description:
      "Backwaters, tea hills, beaches, Ayurveda, and timeless culture — our signature curated journeys across Kerala.",
    image: "/assets/images/kerala-card.jpg",
    href: "/kerala",
    available: true,
  },
  {
    key: "india",
    label: "India",
    tagline: "Incredible India",
    description:
      "From the Himalayas to the heritage cities and coastal getaways — pan-India journeys crafted with care.",
    image: "/assets/images/india-card.jpg",
    href: "/india",
    available: true,
  },
  {
    key: "world",
    label: "World",
    tagline: "Beyond Borders",
    description:
      "Handpicked international escapes — from island retreats to cultural capitals, designed around you.",
    image: "/assets/images/world-card.jpg",
    href: "/world",
    available: true,
  },
];

const offices = [
  {
    key: "kerala",
    label: "Kerala Office",
    address:
      "Opp. Sreevalsam Auditorium, Theru Road, Nileshwar, Kasaragod, Kerala",
    mapHref: "https://goo.gl/maps/1vWdC9P62dLof5bD8",
    phone: "+91 94464 60533",
    phoneHref: "tel:+919446460533",
  },
  {
    key: "delhi",
    label: "Delhi Office",
    address:
      "G25, Plot No 4, Vardhman Market, Sector 2 - Dwarka, New Delhi 110075",
    mapHref:
      "https://www.google.com/maps/search/?api=1&query=G25%2C+Plot+No+4%2C+Vardhman+Market%2C+Sector+2+Dwarka%2C+New+Delhi+110075",
    phone: "+91 85888 97153",
    phoneHref: "tel:+918588897153",
  },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/storybookholidays/",
    icon: "fa-instagram",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/ExploreTheUntoldStories",
    icon: "fa-facebook",
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/919446460533?text=Hello%20Storybook%20Holidays!",
    icon: "fa-whatsapp",
  },
];

const BHUTAN_ESCAPES_URL = "https://bhutanescapes.com/";
const GOOGLE_REVIEW_URL = "https://share.google/AexWgj2zvsrfYtVGB";
const GOOGLE_RATING = "4.9";

const backgroundSlides = [
  "/assets/images/slide-athirappally.jpg",
  "/assets/images/slide7.jpg",
  "/assets/images/slide-kumarakam.jpg",
  "/assets/images/slide4.jpg",
];

function Landing() {
  const [activeSlide, setActiveSlide] = React.useState(0);
  const [loadedSlides, setLoadedSlides] = React.useState(() => new Set([0]));
  const [regions, setRegions] = React.useState(fallbackRegions);
  const [isContactOpen, setIsContactOpen] = React.useState(false);
  const closeContact = React.useCallback(() => setIsContactOpen(false), []);

  React.useEffect(() => {
    let isMounted = true;

    getRegions()
      .then((response) => {
        if (!isMounted) return;
        const configuredRegions = (response.data || []).map((entry) => ({
          key: entry.slug || entry.region,
          label: entry.title || entry.region,
          region: entry.region,
          tagline: entry.tagline || "",
          description: entry.description || "",
          image: entry.imageUrl || "/assets/images/kerala-card.jpg",
          href: `/${entry.slug || String(entry.region || "").toLowerCase()}`,
          available: entry.isActive !== false,
        }));

        if (configuredRegions.length > 0) {
          setRegions(configuredRegions);
        }
      })
      .catch(() => {
        setRegions(fallbackRegions);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  React.useEffect(() => {
    if (loadedSlides.size >= backgroundSlides.length) return undefined;
    const nextIndex = (activeSlide + 1) % backgroundSlides.length;
    if (loadedSlides.has(nextIndex)) return undefined;
    const preloadImg = new Image();
    preloadImg.src = backgroundSlides[nextIndex];
    preloadImg.onload = () => {
      setLoadedSlides((prev) => {
        if (prev.has(nextIndex)) return prev;
        const updated = new Set(prev);
        updated.add(nextIndex);
        return updated;
      });
    };
    return () => {
      preloadImg.onload = null;
    };
  }, [activeSlide, loadedSlides]);

  React.useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % backgroundSlides.length);
    }, 5500);
    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="region-landing">
      <Seo
        title="The Story Begins — Curated Kerala, India & World Holidays"
        description="Choose your story — explore Kerala backwaters and hill escapes, journeys across India, or international getaways, all curated by Story Book Holidays."
        path="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "TravelAgency",
          name: "Story Book Holidays",
          url: "https://storybookholidays.com",
          logo: "https://storybookholidays.com/favicon.png",
          image:
            "https://storybookholidays.com/assets/images/slide-athirappally.jpg",
          telephone: "+91-94464-60533",
          email: "info@storybookholidays.com",
          address: [
            {
              "@type": "PostalAddress",
              streetAddress: "Opp. Sreevalsam Auditorium, Theru Road",
              addressLocality: "Nileshwar",
              addressRegion: "Kasaragod, Kerala",
              addressCountry: "IN",
            },
            {
              "@type": "PostalAddress",
              streetAddress:
                "G25, Plot No 4, Vardhman Market, Sector 2 - Dwarka",
              addressLocality: "New Delhi",
              postalCode: "110075",
              addressRegion: "Delhi",
              addressCountry: "IN",
            },
          ],
          sameAs: [
            "https://www.instagram.com/storybookholidays/",
            "https://www.facebook.com/ExploreTheUntoldStories",
          ],
          areaServed: ["Kerala", "India", "Worldwide"],
        }}
      />
      <div className="region-landing-bg" aria-hidden="true">
        {backgroundSlides.map((image, index) => (
          <div
            key={image}
            className={`region-landing-slide ${index === activeSlide ? "is-active" : ""}`}
            style={
              loadedSlides.has(index)
                ? { backgroundImage: `url('${image}')` }
                : undefined
            }
          />
        ))}
        <div className="region-landing-overlay" />
      </div>

      <header className="region-landing-header">
        <a href="/" className="region-landing-brand">
          <img src="/assets/images/logo/logo.png" alt="Story Book Holidays" />
          <div>
            <strong>Story Book Holidays</strong>
            <span>Curated journeys with soul</span>
          </div>
        </a>
        <a
          href="https://wa.me/919446460533?text=Hello%20Storybook%20Holidays!"
          className="button region-landing-cta"
          target="_blank"
          rel="noreferrer"
        >
          Plan on WhatsApp
        </a>
      </header>

      <main className="region-landing-main">
        <div className="region-landing-intro">
          <span className="region-landing-eyebrow">Choose your story</span>
          <h1>The story begins here.</h1>
          <p>
            Where would you like to travel? Three distinct canvases, one trusted
            travel team. Pick a region to start planning your next holiday.
          </p>
        </div>

        <div className="region-card-grid">
          {regions.map((region) => (
            <a
              key={region.key}
              href={region.href}
              className={`region-card ${region.available ? "" : "is-soon"}`}
              style={{ backgroundImage: `url('${region.image}')` }}
              onClick={() => {
                if (region.available) {
                  setStoredRegion(region.region || region.label);
                }
              }}
            >
              <div className="region-card-overlay" />
              <div className="region-card-content">
                <span className="region-card-tagline">{region.tagline}</span>
                <h2>{region.label}</h2>
                <p>{region.description}</p>
                <span className="region-card-action">
                  {region.available
                    ? `Explore ${region.label} →`
                    : "Coming Soon"}
                </span>
              </div>
              {!region.available && (
                <span className="region-card-badge">Coming Soon</span>
              )}
            </a>
          ))}
        </div>

        <section
          className="landing-connect"
          aria-labelledby="landing-connect-title"
        >
          <div className="landing-connect-intro">
            <span className="region-landing-eyebrow">Plan with confidence</span>
            <h2 id="landing-connect-title">
              Explore the untold stories of India.
            </h2>
            <p>
              From backwaters to hill stations, we make the route, stays, and
              support feel seamless.
            </p>
            <div className="landing-connect-actions">
              <button
                type="button"
                className="button landing-connect-button"
                onClick={() => setIsContactOpen(true)}
              >
                Let’s Talk
              </button>
              <a
                href="mailto:info@storybookholidays.com"
                className="landing-connect-email"
              >
                <i className="fa fa-envelope" aria-hidden="true" />
                info@storybookholidays.com
              </a>
            </div>
            <div className="landing-connect-social-row">
              <div className="landing-social-links">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    aria-label={link.label}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className={`fa ${link.icon}`} aria-hidden="true" />
                  </a>
                ))}
              </div>

              <a
                className="landing-google-card"
                href={GOOGLE_REVIEW_URL}
                target="_blank"
                rel="noreferrer"
                aria-label={`Rated ${GOOGLE_RATING} on Google. Write your review`}
              >
                <span className="landing-google-score">{GOOGLE_RATING}</span>
                <span className="landing-google-body">
                  <span className="landing-google-brand">
                    <svg
                      viewBox="0 0 24 24"
                      width="22"
                      height="22"
                      aria-hidden="true"
                    >
                      <path
                        fill="#4285F4"
                        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5c-.3 1.5-1.1 2.8-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.7z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.2v3.1C3.2 21.3 7.3 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.3 14.3c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3V6.6H1.2C.4 8.2 0 10 0 12s.4 3.8 1.2 5.4l4.1-3.1z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C18 1.2 15.2 0 12 0 7.3 0 3.2 2.7 1.2 6.6l4.1 3.1c.9-2.9 3.6-4.9 6.7-4.9z"
                      />
                    </svg>
                    Google
                  </span>
                  <span className="landing-google-review">
                    Write Your Review
                    <span className="landing-google-stars" aria-hidden="true">
                      ★★★★★
                    </span>
                  </span>
                </span>
              </a>
            </div>
          </div>

          <div className="landing-connect-cards">
            {offices.map((office) => (
              <article className="landing-office-card" key={office.key}>
                <span className="landing-office-icon">
                  <i className="fa fa-map-marker" aria-hidden="true" />
                </span>
                <h3>{office.label}</h3>
                <a href={office.mapHref} target="_blank" rel="noreferrer">
                  {office.address}
                </a>
                <a href={office.phoneHref} className="landing-office-phone">
                  <i className="fa fa-phone" aria-hidden="true" />
                  {office.phone}
                </a>
              </article>
            ))}

            <a
              className="landing-office-card landing-bhutan-card"
              href={BHUTAN_ESCAPES_URL}
              target="_blank"
              rel="noreferrer"
            >
              <span className="landing-bhutan-logo">
                <img
                  src="/assets/images/bhutan-escapes-logo.png"
                  alt="Bhutan Escapes"
                  width="160"
                  height="80"
                  loading="lazy"
                />
              </span>
              <span className="landing-bhutan-kicker">
                A new venture from Story Book Holidays
              </span>
              <h3>Bhutan Escapes</h3>
              <p>Exclusively for Bhutan journeys.</p>
            </a>
          </div>
        </section>
      </main>

      <ContactModal open={isContactOpen} onClose={closeContact} />

      <footer className="region-landing-footer">
        <small>
          © {new Date().getFullYear()} Story Book Holidays. All rights reserved.
        </small>
      </footer>
    </div>
  );
}

export default Landing;
