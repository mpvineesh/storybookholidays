import React from 'react';
import { useLocation } from 'react-router-dom';

const regionCopy = {
  india: {
    label: 'India',
    tagline: 'Incredible India',
    description:
      'We are curating unforgettable journeys across India — heritage cities, Himalayan escapes, and hidden coastal gems. Sign up and be the first to hear when our India itineraries launch.',
    image: '/assets/images/banner.jpg',
  },
  world: {
    label: 'World',
    tagline: 'Beyond Borders',
    description:
      'Handpicked international holidays are on the way — from tropical retreats to cultural capitals. Leave your details and we will reach out as soon as we are ready to take you abroad.',
    image: '/assets/images/roads.jpg',
  },
};

function ComingSoon() {
  const location = useLocation();
  const slug = location.pathname.replace(/\//g, '').toLowerCase();
  const region = regionCopy[slug] || {
    label: 'This destination',
    tagline: 'Coming Soon',
    description:
      'We are working on something special for this region. Check back soon or reach out on WhatsApp to get early updates.',
    image: '/assets/images/slide-athirappally.jpg',
  };

  return (
    <div
      className="coming-soon-page"
      style={{ backgroundImage: `url('${region.image}')` }}
    >
      <div className="coming-soon-overlay" />

      <header className="coming-soon-header">
        <a href="/" className="coming-soon-brand">
          <img src="/assets/images/logo/logo.png" alt="Story Book Holidays" />
          <span>Story Book Holidays</span>
        </a>
        <a href="/" className="coming-soon-back">
          ← Back to regions
        </a>
      </header>

      <main className="coming-soon-content">
        <span className="coming-soon-eyebrow">{region.tagline}</span>
        <h1>{region.label} journeys are coming soon.</h1>
        <p>{region.description}</p>

        <div className="coming-soon-actions">
          <a
            href="https://wa.me/919446460533?text=Hi%20Storybook%20Holidays%2C%20please%20notify%20me%20when%20new%20destinations%20launch."
            className="button"
            target="_blank"
            rel="noreferrer"
          >
            Notify me on WhatsApp
          </a>
          <a href="/home" className="button button-outline">
            Explore Kerala instead
          </a>
        </div>

        <div className="coming-soon-meta">
          <div>
            <strong>Email</strong>
            <span>hello@storybookholidays.com</span>
          </div>
          <div>
            <strong>Call</strong>
            <span>+91 94464 60533</span>
          </div>
        </div>
      </main>

      <footer className="coming-soon-footer">
        <small>© {new Date().getFullYear()} Story Book Holidays. All rights reserved.</small>
      </footer>
    </div>
  );
}

export default ComingSoon;
