import React from 'react';
import Header from '../common/header';
import Footer from '../common/footer';
import Seo from '../common/Seo';
import { getAboutContent } from '../services/aboutContentApi';
import { defaultAboutContent, mergeAboutContent } from '../services/aboutContentDefaults';

function About() {
  const [content, setContent] = React.useState(defaultAboutContent);

  React.useEffect(() => {
    let isMounted = true;

    getAboutContent()
      .then((response) => {
        if (!isMounted) return;
        setContent(mergeAboutContent(response.data));
      })
      .catch(() => {
        /* keep defaults */
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const { hero, story, mission, whyBook, services, guarantee } = content;

  return (
    <React.Fragment>
      <Seo
        title="Our Story"
        description="Story Book Holidays is a Kerala-based curated travel agency founded by Justin Jose. Read our story, mission, and the inspiration behind every journey."
        path="/about"
      />
      <Header parent="Our Story" />
      <main className="content about-page">
        <section
          className="about-hero"
          style={{ backgroundImage: `url('${hero.backgroundImageUrl}')` }}
        >
          <div className="container">
            <div className="about-hero-inner">
              <span className="eyebrow about-hero-eyebrow">{hero.eyebrow}</span>
              <h1 className="about-hero-title">{hero.title}</h1>
              <p className="about-hero-lead">{hero.lead}</p>
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
                {hero.stats.map((stat) => (
                  <div className="about-stat" key={stat.label}>
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="fullwidth-block about-story-section" id="our-story">
          <div className="container">
            <div className="about-story-grid">
              <div className="about-story-copy">
                <p className="section-kicker">{story.kicker}</p>
                <h2 className="section-title">{story.title}</h2>
                {story.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
                <p className="about-story-signature">
                  <span>{story.signatureName}</span>
                  <small>{story.signatureRole}</small>
                </p>
              </div>
              <aside className="about-story-aside">
                <div className="about-story-card">
                  <p className="section-kicker">{story.glanceKicker}</p>
                  <ul className="about-story-list">
                    {story.glance.map((item) => (
                      <li key={item.title}>
                        <strong>{item.title}</strong>
                        <span>{item.description}</span>
                      </li>
                    ))}
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
                <p className="section-kicker">{mission.kicker}</p>
                <h2 className="section-title">{mission.title}</h2>
              </div>
            </div>
            <div className="about-mission-grid">
              {mission.cards.map((item) => (
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
                <p className="section-kicker">{whyBook.kicker}</p>
                <h2 className="section-title">{whyBook.title}</h2>
              </div>
            </div>
            <div className="about-why-grid">
              {whyBook.cards.map((item, index) => (
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
                <p className="section-kicker">{services.kicker}</p>
                <h2 className="section-title">{services.title}</h2>
                <p>{services.description}</p>
                <ul className="about-services-list">
                  {services.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <a href="/packages" className="button">
                  Explore our packages
                </a>
              </div>

              <aside className="about-guarantee-card">
                <p className="section-kicker">{guarantee.kicker}</p>
                <h3>{guarantee.title}</h3>
                <p>{guarantee.body}</p>
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
