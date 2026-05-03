import React from 'react';

const quickLinks = [
  { label: 'Holiday Packages', href: '/packages' },
  { label: 'Destinations', href: '/destinations' },
  { label: 'About Story Book', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
];

const travelThemes = [
  { label: 'Backwaters', href: '/backwaters' },
  { label: 'Ayurveda', href: '/ayurveda' },
  { label: 'Performing Arts', href: '/arts' },
  { label: 'Theyyam', href: '/theyyam' },
];

// const planningSteps = [
//   {
//     title: 'Tell us your travel mood',
//     description: 'Share dates, group size, and whether you want beaches, hills, culture, or slower luxury.',
//   },
//   {
//     title: 'We shape the route',
//     description: 'Stays, transfers, and day flow are arranged into one Kerala journey that feels smooth from the start.',
//   },
//   {
//     title: 'Travel with local support',
//     description: 'From arrival to final drop, our team stays reachable so your holiday remains easy and well-paced.',
//   },
// ];


const contactCards = [
  {
    icon: 'fa-map-marker',
    label: 'Kasaragod Office',
    value: 'Opp. Sreevalsam Auditorium, Theru Road, Nileshwar, Kasaragod',
    href: 'https://goo.gl/maps/1vWdC9P62dLof5bD8',
    external: true,
  },
  {
    icon: 'fa-map-marker',
    label: 'Kochi Office',
    value: '2nd floor, Thahi Complex, Chakkaraparambu Road, Vennala, Kochi',
    href: 'https://goo.gl/maps/yoGWxrnNHb8XG7Z8A',
    external: true,
  },
  {
    icon: 'fa-map-marker',
    label: 'Delhi Office',
    value: 'G25, Plot No 4, Vardhman Market, Sector 2 - Dwarka, New Delhi 110075',
    href: 'https://www.google.com/maps/search/?api=1&query=G25%2C+Plot+No+4%2C+Vardhman+Market%2C+Sector+2+Dwarka%2C+New+Delhi+110075',
    external: true,
  },
  {
    icon: 'fa-phone',
    label: 'Reach Us',
    rows: [
      [
        { value: '+91 94464 60533', href: 'tel:+919446460533', icon: 'fa-phone' },
        { value: '+91 85888 97153', href: 'tel:+918588897153', icon: 'fa-phone' },
      ],
      [
        {
          value: 'info@storybookholidays.com',
          href: 'mailto:info@storybookholidays.com',
          icon: 'fa-envelope',
        },
      ],
    ],
  },
];

const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/story_book_holidays?igshid=xcyefcxv1e4m',
    icon: 'fa-instagram',
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/',
    icon: 'fa-facebook',
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/919446460533?text=Hello%20Storybook%20Holidays!',
    icon: 'fa-whatsapp',
  },
];

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
  

        <div className="footer-cta-card">
          <div className="footer-cta-copy">
            <p className="footer-kicker">Ready for your next escape?</p>
            <h2>Let’s design a Kerala holiday that feels personal from day one.</h2>
            <p className="footer-cta-note">
              Share your pace, favorite experiences, and travel dates. We will shape a Kerala
              route that feels thoughtful from the first call.
            </p>
          </div>

          <div className="footer-cta-actions">
            <span className="footer-cta-highlight">
              Custom itineraries. Local support. Zero guesswork.
            </span>
            <a
              href="https://wa.me/919446460533?text=Hello%20Storybook%20Holidays!"
              className="button footer-cta-button"
              target="_blank"
              rel="noreferrer"
            >
              Start Planning
            </a>
            <div className="footer-support-points">
              <span>Private route planning</span>
              <span>Handpicked stays</span>
              <span>Direct local assistance</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-top">
        <div className="container footer-grid">
          <div className="widget footer-brand footer-panel">
            <img
              src="/assets/images/logo/logo.png"
              alt="Story Book Holidays"
              width="120"
              height="72"
              className="logo"
            />
            <p className="footer-panel-label">Story Book Holidays</p>
            <h3 className="widget-title">Kerala journeys with warmth, pacing, and local insight.</h3>
            <p>
              We create travel stories that balance scenic highlights with comfort, cultural
              texture, and practical support all along the route.
            </p>
            <div className="footer-social-links">
              {socialLinks.map((socialLink) => (
                <a
                  href={socialLink.href}
                  key={socialLink.label}
                  aria-label={socialLink.label}
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className={`fa ${socialLink.icon}`} />
                </a>
              ))}
            </div>
          </div>

          <div className="widget footer-panel">
            <p className="footer-panel-label">Explore</p>
            <h3 className="widget-title">Start with the essentials.</h3>
            <ul className="list-arrow footer-links">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="widget footer-panel">
            <p className="footer-panel-label">Travel Themes</p>
            <h3 className="widget-title">Choose the Kerala mood you want most.</h3>
            <ul className="list-arrow footer-links">
              {travelThemes.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="widget widget-customer-info footer-panel">
            <p className="footer-panel-label">Customer Service</p>
            <h3 className="widget-title">Real people, direct answers, and steady support.</h3>
            <div className="cs-info">
              <p className="footer-panel-copy">
                Quality service stays at the center of every itinerary, from your first enquiry
                to the final airport transfer home.
              </p>
              <p className="footer-contact-stack">
                <a href="tel:+919446460533">+91 94464 60533</a>
                <a href="mailto:info@storybookholidays.com">info@storybookholidays.com</a>
              </p>
              <div className="footer-support-points footer-support-points-soft">
                <span>WhatsApp-first planning</span>
                <span>Private family trips</span>
                <span>Support across Kerala</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-wrap">
          <div className="branding footer-bottom-intro">
            <p className="footer-kicker footer-kicker-soft">Plan with confidence</p>
            <h3 className="site-title">
              <a href="/home">Explore the untold stories of Kerala.</a>
            </h3>
            <small className="site-description">
              From backwaters to hill stations, we make the route, stays, and support feel
              seamless.
            </small>
          </div>

          <div className="contact-links">
            {contactCards.map((contact) => {
              if (contact.rows) {
                return (
                  <div className="contact-card contact-card-multi" key={contact.label}>
                    <i className={`fa ${contact.icon}`} />
                    <span className="contact-copy">
                      <span className="contact-label">{contact.label}</span>
                      {contact.rows.map((row, rowIndex) => (
                        <span className="contact-line-row" key={rowIndex}>
                          {row.map((line) => (
                            <a
                              key={line.href}
                              href={line.href}
                              className="contact-line"
                            >
                              {line.icon ? (
                                <i className={`fa ${line.icon} contact-line-icon`} />
                              ) : null}
                              <span className="contact-value">{line.value}</span>
                            </a>
                          ))}
                        </span>
                      ))}
                    </span>
                  </div>
                );
              }

              const linkProps = contact.external
                ? { target: '_blank', rel: 'noreferrer' }
                : {};

              return (
                <a href={contact.href} key={contact.label} {...linkProps}>
                  <i className={`fa ${contact.icon}`} />
                  <span className="contact-copy">
                    <span className="contact-label">{contact.label}</span>
                    <span className="contact-value">{contact.value}</span>
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="colophon">
        <div className="container colophon-wrap">
          <p className="copy">Copyright {currentYear} Story Book Holidays. All rights reserved.</p>
          <p className="colophon-note">Kerala-based holiday planners with offices in Kasaragod, Kochi and New Delhi.</p>
        </div>
      </div>

      <a
        href="https://wa.me/919446460533?text=Hello%20Storybook%20Holidays!"
        className="wa-float"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <i className="fa fa-whatsapp wa-float-icon" />
      </a>
    </footer>
  );
}

export default Footer;
