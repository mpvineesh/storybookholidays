import React from 'react';

const regions = [
  {
    key: 'kerala',
    label: 'Kerala',
    tagline: "God's Own Country",
    description:
      'Backwaters, tea hills, beaches, Ayurveda, and timeless culture — our signature curated journeys across Kerala.',
    image: '/assets/images/slide-kumarakam.jpg',
    href: '/home',
    available: true,
  },
  {
    key: 'india',
    label: 'India',
    tagline: 'Incredible India',
    description:
      'From the Himalayas to the heritage cities and coastal getaways — pan-India journeys crafted with care.',
    image: '/assets/images/banner.jpg',
    href: '/india',
    available: false,
  },
  {
    key: 'world',
    label: 'World',
    tagline: 'Beyond Borders',
    description:
      'Handpicked international escapes — from island retreats to cultural capitals, designed around you.',
    image: '/assets/images/roads.jpg',
    href: '/world',
    available: false,
  },
];

const backgroundSlides = [
  '/assets/images/slide-athirappally.jpg',
  '/assets/images/slide7.jpg',
  '/assets/images/slide-kumarakam.jpg',
  '/assets/images/slide4.jpg',
];

function Landing() {
  const [activeSlide, setActiveSlide] = React.useState(0);
  const [loadedSlides, setLoadedSlides] = React.useState(() => new Set([0]));

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
      <div className="region-landing-bg" aria-hidden="true">
        {backgroundSlides.map((image, index) => (
          <div
            key={image}
            className={`region-landing-slide ${index === activeSlide ? 'is-active' : ''}`}
            style={loadedSlides.has(index) ? { backgroundImage: `url('${image}')` } : undefined}
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
          <h1>Where would you like to travel?</h1>
          <p>
            Three distinct canvases, one trusted travel team. Pick a region to start planning
            your next holiday.
          </p>
        </div>

        <div className="region-card-grid">
          {regions.map((region) => (
            <a
              key={region.key}
              href={region.href}
              className={`region-card ${region.available ? '' : 'is-soon'}`}
              style={{ backgroundImage: `url('${region.image}')` }}
            >
              <div className="region-card-overlay" />
              <div className="region-card-content">
                <span className="region-card-tagline">{region.tagline}</span>
                <h2>{region.label}</h2>
                <p>{region.description}</p>
                <span className="region-card-action">
                  {region.available ? 'Explore Kerala →' : 'Coming Soon'}
                </span>
              </div>
              {!region.available && <span className="region-card-badge">Coming Soon</span>}
            </a>
          ))}
        </div>
      </main>

      <footer className="region-landing-footer">
        <small>© {new Date().getFullYear()} Story Book Holidays. All rights reserved.</small>
      </footer>
    </div>
  );
}

export default Landing;
