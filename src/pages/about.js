import React from 'react';
import Header from '../common/header';
import Footer from '../common/footer';
import Seo from '../common/Seo';

const founderStory = [
  'As an ardent and passionate travel lover, I, Justin Jose, have always loved the aspects and prospects of tourism. To help people around the world explore and discover this marvelous creation called earth has always fascinated me to the core. This desire and passion has driven me to where I am today.',
  'After a bachelor’s degree in Electronics from Hyderabad I joined the hospitality sector as a Unit Manager in a guest house — almost unexpectedly. Guests there would light up when I said I hail from Kerala. They asked me about everything from tourist places to festivals, climate and people. Quite often the conversations stretched past closing hours, and most of them ended in a quiet wish: to visit Kerala one day.',
  'A wonderful couple, Mr. and Mrs. Podas from Germany, who visited India every year, asked if they could come to my hometown Bekal — beaches, forts, slow village life. That trip was the first complete itinerary I designed: hotel, food, transport, beach mornings, fort walks, temples and churches. Their happiness told me this was more than a job. I joined Mar Ivanios College, Trivandrum, for a Post Graduation in Tourism, took up a front-office role at a leading 3-star hotel, and later worked with the Kerala Tourism Information Centre — learning the state, its people and what travelers really look for.',
  'After my Post Graduation I joined a 5-star luxury resort in Kumarakom as Activity Coordinator, taking guests into interior villages for sunsets and slow afternoons. A stint with an inbound tour operator in Delhi, sending Australian and New Zealand travellers across India, sharpened the craft further. A move to Calicut to source travellers from Dubai, Qatar, Abu Dhabi and Muscat finally lit the spark — to start an agency focused on inbound tourism to God’s own country, Kerala, for travellers from every corner of India and the world.',
];

const missionVision = [
  {
    label: 'Our Mission',
    title: 'Quality, excellence, and unforgettable encounters.',
    body:
      'Travelling with Story Book stands for inspiration — for the often surprising, touching encounters along the way. Guided by the philosophy of “travelling to yourself and others”, we invite you into the most impressive regions of the Indian subcontinent and the most beautiful corners of Kerala. From Ayurveda to hill stations, wildlife to coastal villages, we share the gifts of this land with the rest of the world.',
  },
  {
    label: 'Our Vision',
    title: 'To make the dream of travel possible for everyone.',
    body:
      'Life is a journey, and travel is a dream many quietly hold on to. When you come to us, we add the script to that dream — a thoughtful itinerary, the right people on the ground, and the small details that turn a holiday into a story you keep telling.',
  },
];

const whyBookWithUs = [
  {
    label: 'Once-in-a-Lifetime',
    title: 'Experiences, not just bookings.',
    description:
      'We don’t just book trips; we curate moments. Our specialty is unique, off-the-beaten-path experiences designed to create memories that last a lifetime.',
  },
  {
    label: 'Tailor-Made',
    title: 'Itineraries shaped around you.',
    description:
      'Travel is personal. We craft bespoke vacations that align with your tastes, pace and interests — so you get the absolute most out of every destination.',
  },
  {
    label: '24/7 Support',
    title: 'Calm hands, always on call.',
    description:
      'Should any travel interruptions occur, our expert team is available around the clock to resolve issues quickly — so your only focus remains the journey.',
  },
];

function About() {
  return (
    <React.Fragment>
      <Seo
        title="About Us"
        description="Story Book Holidays is a Kerala-based curated travel agency founded by Justin Jose. Read our story, mission, and the inspiration behind every journey."
        path="/about"
      />
      <Header parent="About" />
      <main className="content about-page">
        <section
          className="about-hero"
          style={{ backgroundImage: "url('/assets/images/slide-kumarakam.jpg')" }}
        >
          <div className="container">
            <div className="about-hero-inner">
              <span className="eyebrow about-hero-eyebrow">About Story Book Holidays</span>
              <h1 className="about-hero-title">
                Curated journeys, shaped by a lifetime of loving travel.
              </h1>
              <p className="about-hero-lead">
                A Kerala-rooted travel studio that designs holidays the way you’d
                want a close friend to plan them — warm, detailed, and quietly luxurious.
                Share your vision with our travel specialists, and we’ll manage the rest.
              </p>
              <div className="about-hero-actions">
                <a href="/packages" className="button">
                  Start planning your trip
                </a>
                <a
                  href="https://wa.me/919446460533?text=Hello%20Storybook%20Holidays!"
                  className="button button-outline"
                  target="_blank"
                  rel="noreferrer"
                >
                  Talk on WhatsApp
                </a>
              </div>

              <div className="about-hero-stats">
                <div className="about-stat">
                  <strong>15+</strong>
                  <span>Years in inbound travel</span>
                </div>
                <div className="about-stat">
                  <strong>40+</strong>
                  <span>Curated experiences</span>
                </div>
                <div className="about-stat">
                  <strong>24/7</strong>
                  <span>Dedicated trip support</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="fullwidth-block about-story-section" id="our-story">
          <div className="container">
            <div className="about-story-grid">
              <div className="about-story-copy">
                <p className="section-kicker">Our Story</p>
                <h2 className="section-title">
                  From a guest house in Hyderabad to itineraries across Kerala and beyond.
                </h2>
                {founderStory.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
                <p className="about-story-signature">
                  <span>— Justin Jose</span>
                  <small>Founder, Story Book Holidays</small>
                </p>
              </div>
              <aside className="about-story-aside">
                <div className="about-story-card">
                  <p className="section-kicker">At a glance</p>
                  <ul className="about-story-list">
                    <li>
                      <strong>Based in Kerala</strong>
                      <span>Designing inbound and outbound holidays since day one.</span>
                    </li>
                    <li>
                      <strong>Founder-led</strong>
                      <span>Itineraries personally reviewed by Justin and his team.</span>
                    </li>
                    <li>
                      <strong>Network-first</strong>
                      <span>Trusted ground partners across every region we operate in.</span>
                    </li>
                    <li>
                      <strong>Slow, considered planning</strong>
                      <span>We map pacing, not just destinations.</span>
                    </li>
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="fullwidth-block about-mission-section">
          <div className="container">
            <div className="section-heading compact">
              <div>
                <p className="section-kicker">What guides us</p>
                <h2 className="section-title">Mission &amp; vision.</h2>
              </div>
            </div>
            <div className="about-mission-grid">
              {missionVision.map((item) => (
                <article className="about-mission-card" key={item.label}>
                  <span className="experience-label">{item.label}</span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="fullwidth-block about-why-section" id="why-book">
          <div className="container">
            <div className="section-heading compact">
              <div>
                <p className="section-kicker">Why book with us</p>
                <h2 className="section-title">
                  The reasons travelers choose Story Book Holidays.
                </h2>
              </div>
            </div>
            <div className="about-why-grid">
              {whyBookWithUs.map((item, index) => (
                <article className="about-why-card" key={item.label}>
                  <span className="about-why-number">0{index + 1}</span>
                  <span className="experience-label">{item.label}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="fullwidth-block about-services-section">
          <div className="container">
            <div className="about-services-grid">
              <div className="about-services-copy">
                <p className="section-kicker">Our Services</p>
                <h2 className="section-title">
                  From luxury resort stays to fully curated holiday packages.
                </h2>
                <p>
                  We handle every detail of your journey — flights and transfers,
                  hand-picked stays, on-ground experiences, and the small comforts
                  in between. Simply share your vision with our travel specialists,
                  and we’ll manage the rest.
                </p>
                <ul className="about-services-list">
                  <li>Bespoke holiday packages across Kerala, India and the world</li>
                  <li>Luxury resort and boutique stay curation</li>
                  <li>Honeymoon, family, group and solo itineraries</li>
                  <li>Private transport, guides and on-ground coordination</li>
                </ul>
                <a href="/packages" className="button">
                  Explore our packages
                </a>
              </div>

              <aside className="about-guarantee-card">
                <p className="section-kicker">Satisfaction guarantee</p>
                <h3>Your peace of mind is our priority.</h3>
                <p>
                  We are committed to providing a seamless experience from the
                  moment you book until you return home. Have questions? Reach
                  out to our team — we’re here to make sure you travel with
                  confidence for years to come.
                </p>
                <div className="about-guarantee-actions">
                  <a href="/contact" className="button">
                    Talk to a specialist
                  </a>
                  <a
                    href="https://wa.me/919446460533?text=Hello%20Storybook%20Holidays!"
                    className="button button-outline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp us
                  </a>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </React.Fragment>
  );
}

export default About;
