import React from 'react';
import Header from '../common/header';
import Footer from '../common/footer';
import Seo from '../common/Seo';

function Hotels() {
  return (
    <React.Fragment>
      <Seo
        title="Curated Stays"
        description="Handpicked hotels, resorts, homestays, and houseboats from Story Book Holidays are coming soon. Reach out to plan your stay today."
        path="/hotels"
      />
      <Header parent="Curated Stays" />
      <main className="content">
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
      </main>
      <Footer />
    </React.Fragment>
  );
}

export default Hotels;
