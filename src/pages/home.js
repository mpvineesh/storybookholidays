import React from 'react';
import Header from '../common/header';
import Footer from '../common/footer';
import DatService from '../services/dataService';

const destinationHighlights = [
  {
    title: 'Munnar',
    subtitle: 'Tea gardens and cloud-kissed viewpoints',
    description:
      'Wake up to rolling plantations, cool mountain air, and slow scenic drives through Kerala’s most iconic hill escape.',
    image: '/assets/images/slide7.jpg',
    highlights: ['Tea estates', 'Waterfalls', 'Romantic stays'],
  },
  {
    title: 'Alleppey',
    subtitle: 'Backwater cruises with golden sunsets',
    description:
      'Glide past village canals, coconut groves, and lakeside life on curated houseboat experiences built for pure calm.',
    image: '/assets/images/slide-kumarakam.jpg',
    highlights: ['Houseboats', 'Village trails', 'Sunset decks'],
  },
  {
    title: 'Kovalam',
    subtitle: 'Beach days with wellness and culture',
    description:
      'Blend sea breezes, Ayurvedic indulgence, and easy coastal evenings in one of Kerala’s most loved shoreline escapes.',
    image: '/assets/images/slide4.jpg',
    highlights: ['Beach resorts', 'Ayurveda', 'Ocean views'],
  },
];

const heroSlides = [
  {
    title: 'Kumarakom',
    subtitle: 'Lakeside mornings and unhurried backwater stays',
    description:
      'Ease into Kerala with premium houseboats, village canals, and soft golden evenings beside Vembanad Lake.',
    image: '/assets/images/slide-kumarakam.jpg',
    highlights: ['Luxury houseboats', 'Bird sanctuary', 'Slow travel'],
  },
  {
    title: 'Munnar',
    subtitle: 'Mist, tea gardens, and scenic mountain roads',
    description:
      'Trade city noise for cool air, rolling plantations, and lookouts that make every drive feel cinematic.',
    image: '/assets/images/slide7.jpg',
    highlights: ['Tea estates', 'Waterfalls', 'Hill retreats'],
  },
  {
    title: 'Athirappilly',
    subtitle: 'Rainforest routes and Kerala’s dramatic waterfall escape',
    description:
      'Layer forest stays, monsoon greens, and the roar of iconic falls into a stop that feels both wild and restorative.',
    image: '/assets/images/slide-athirappally.jpg',
    highlights: ['Waterfall views', 'Rainforest drives', 'Nature stays'],
  },
  {
    title: 'Kovalam',
    subtitle: 'Sea breezes, wellness, and sunset beach time',
    description:
      'Balance shorefront relaxation with Ayurvedic comforts and leisurely evenings along Kerala’s most loved coast.',
    image: '/assets/images/slide4.jpg',
    highlights: ['Beach resorts', 'Ayurveda', 'Ocean sunsets'],
  },
];

const planningPoints = [
  'Tailor-made itineraries across Kerala',
  'Trusted driver-guides and smooth transfers',
  'Handpicked stays, cruises, and local experiences',
];

const experienceThemes = [
  {
    label: 'Slow Luxury',
    title: 'Thoughtful journeys with space to breathe',
    description:
      'We balance signature sights with quiet moments so your holiday feels restorative, not rushed.',
  },
  {
    label: 'Local Insight',
    title: 'Kerala through stories, food, and culture',
    description:
      'From village life to living traditions, each route is shaped with local knowledge that adds depth to every stop.',
  },
  {
    label: 'Seamless Support',
    title: 'Everything arranged before you arrive',
    description:
      'Accommodation, transport, and activity planning come together in one coordinated experience from start to finish.',
  },
];

const travelerStats = [
  { value: '7+', label: 'Curated Kerala packages' },
  { value: '100%', label: 'Private planning support' },
  { value: '2', label: 'Office locations in Kerala' },
  { value: '365', label: 'Days to start your next story' },
];

const testimonials = [
  {
    image: '/assets/images/anand.jpeg',
    quote:
      'They delivered the service word by word as they told me. I will definitely travel with Story Book Holidays again.',
    name: 'Anand',
    role: 'Family Traveler',
  },
  {
    image: '/assets/images/testimonial1.jpeg',
    quote:
      'The hotel selection was excellent and the vehicle was maintained beautifully. Our family trip felt easy and memorable throughout.',
    name: 'Eraz',
    role: 'Holiday Traveler',
  },
  {
    image: '/assets/images/gregory.jpeg',
    quote:
      'The whole trip turned out to be a pleasant experience and quite economical. The accommodation choices were especially impressive.',
    name: 'Gregory Vian',
    role: 'Traveler from Australia',
  },
  {
    image: '/assets/images/vinay.jpeg',
    quote:
      'We enjoyed our tour in Kerala with Story Book Holidays, especially the coordination and support in every city.',
    name: 'Vinay A Singh',
    role: 'Group Traveler',
  },
];

function Home() {
  const [packages, setPackages] = React.useState([]);
  const [activeHeroSlide, setActiveHeroSlide] = React.useState(0);

  React.useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      const data = await new DatService().getPackages();

      if (isMounted) {
        setPackages(data.slice(0, 4));
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  React.useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveHeroSlide((currentSlide) => (currentSlide + 1) % heroSlides.length);
    }, 5000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const currentHeroSlide = heroSlides[activeHeroSlide];

  return (
    <React.Fragment>
      <Header />
      <main className="content home-page">
        <section className="hero-section">
          <div className="hero-background-slides" aria-hidden="true">
            {heroSlides.map((slide, index) => (
              <div
                className={`hero-background-slide ${index === activeHeroSlide ? 'is-active' : ''}`}
                key={slide.title}
                style={{ backgroundImage: `url('${slide.image}')` }}
              />
            ))}
          </div>
          <div className="container">
            <div className="hero-grid">
              <div className="hero-copy">
                <span className="eyebrow">Curated Kerala travel, beautifully planned</span>
                <h1>Turn every holiday into a story worth retelling.</h1>
                <p>
                  Explore backwaters, hill stations, beaches, and cultural landmarks with a
                  travel team that shapes each itinerary around comfort, beauty, and memorable
                  local experiences.
                </p>
                <div className="hero-actions">
                  <a href="/packages" className="button hero-button">
                    Explore Packages
                  </a>
                  <a
                    href="https://wa.me/919446460533?text=Hello%20Storybook%20Holidays!"
                    className="button button-outline hero-button"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Plan on WhatsApp
                  </a>
                </div>
                <div className="hero-badges">
                  <span>Private escapes</span>
                  <span>Trusted local expertise</span>
                  <span>Backwaters to beaches</span>
                </div>
                <div className="hero-slide-indicators" aria-label="Hero background slideshow controls">
                  {heroSlides.map((slide, index) => (
                    <button
                      type="button"
                      className={index === activeHeroSlide ? 'is-active' : ''}
                      onClick={() => setActiveHeroSlide(index)}
                      key={slide.title}
                      aria-label={`Show ${slide.title}`}
                    />
                  ))}
                </div>
              </div>

              <div className="hero-panel">
                <article className="hero-spotlight">
                  <div
                    className="spotlight-image"
                    style={{ backgroundImage: `url('${currentHeroSlide.image}')` }}
                  />
                  <div className="spotlight-content">
                    <span className="spotlight-label">Featured escape</span>
                    <h2>{currentHeroSlide.title}</h2>
                    <p>{currentHeroSlide.description}</p>
                    <div className="spotlight-meta">
                      {currentHeroSlide.highlights.map((highlight) => (
                        <span key={highlight}>{highlight}</span>
                      ))}
                    </div>
                  </div>
                </article>

                <aside className="hero-planner-card">
                  <p className="planner-eyebrow">Now showing</p>
                  <h3 className="planner-slide-title">{currentHeroSlide.subtitle}</h3>
                  <p className="planner-copy">{currentHeroSlide.description}</p>
                  <p className="planner-eyebrow">Why travelers choose Story Book Holidays</p>
                  <h4 className="planner-heading">
                    Warm planning, clear coordination, unforgettable routes.
                  </h4>
                  <ul className="planner-list">
                    {planningPoints.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </aside>
              </div>
            </div>

            <div className="hero-stats">
              {travelerStats.map((stat) => (
                <div className="stat-card" key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="fullwidth-block destination-showcase">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="section-kicker">Destination highlights</p>
                <h2 className="section-title">Three moods of Kerala, one unforgettable holiday.</h2>
              </div>
              <a href="/destinations" className="section-link">
                View all destinations
              </a>
            </div>

            <div className="destination-grid">
              {destinationHighlights.map((destination) => (
                <article className="destination-card" key={destination.title}>
                  <div
                    className="destination-card-media"
                    style={{ backgroundImage: `url('${destination.image}')` }}
                  />
                  <div className="destination-card-body">
                    <p className="destination-card-subtitle">{destination.subtitle}</p>
                    <h3>{destination.title}</h3>
                    <p>{destination.description}</p>
                    <div className="tag-list">
                      {destination.highlights.map((highlight) => (
                        <span key={highlight}>{highlight}</span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="fullwidth-block offers-section travel-offers">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="section-kicker">Best-selling itineraries</p>
                <h2 className="section-title">Holiday packages designed to feel effortless.</h2>
              </div>
              <a href="/packages" className="section-link">
                Browse all packages
              </a>
            </div>

            <div className="offers-grid">
              {packages.map((pack) => (
                <article className="offer travel-offer" key={pack.packageName}>
                  <figure className="featured-image">
                    <img
                      src={`assets/images/packages/${pack.image}`}
                      className="package-image"
                      alt={pack.title}
                    />
                  </figure>
                  <div className="offer-body">
                    <span className="offer-duration">{pack.duration}</span>
                    <h3 className="entry-title">
                      <a href={`/package?name=${pack.packageName}`}>{pack.title}</a>
                    </h3>
                    <p>{pack.shortDescription}</p>
                    <a href={`/package?name=${pack.packageName}`} className="button">
                      See Details
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="fullwidth-block experience-section">
          <div className="container">
            <div className="section-heading compact">
              <div>
                <p className="section-kicker">Designed around your travel style</p>
                <h2 className="section-title">A more attractive trip starts with better pacing.</h2>
              </div>
            </div>

            <div className="experience-grid">
              {experienceThemes.map((theme) => (
                <article className="experience-card" key={theme.title}>
                  <span className="experience-label">{theme.label}</span>
                  <h3>{theme.title}</h3>
                  <p>{theme.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="fullwidth-block testimonial-section">
          <div className="container">
            <div className="section-heading compact">
              <div>
                <p className="section-kicker">Traveler reviews</p>
                <h2 className="section-title">Guests remember the smoothness as much as the scenery.</h2>
              </div>
            </div>

            <div className="testimonial-grid">
              {testimonials.map((testimonial) => (
                <div className="testimonial" key={testimonial.name}>
                  <figure className="avatar">
                    <img src={testimonial.image} alt={testimonial.name} />
                  </figure>
                  <blockquote className="testimonial-body">
                    <p>{testimonial.quote}</p>
                    <cite>{testimonial.name}</cite>
                    <span>{testimonial.role}</span>
                  </blockquote>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </React.Fragment>
  );
}

export default Home;
