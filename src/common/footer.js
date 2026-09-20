import React from 'react';
import { useRegionContent } from '../context/RegionContext';
import { resolveFooterContent } from '../services/footerDefaults';

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
    rows: [
      [
        {
          value: 'Opp. Sreevalsam Auditorium, Theru Road, Nileshwar, Kasaragod',
          href: 'https://goo.gl/maps/1vWdC9P62dLof5bD8',
          external: true,
        },
      ],
      [
        { value: '+91 94464 60533', href: 'tel:+919446460533', icon: 'fa-phone' },
      ],
    ],
  },
  {
    icon: 'fa-map-marker',
    label: 'Kochi Office',
    rows: [
      [
        {
          value: 'First Floor 1B Sabaasha Dreams, Above Okay Mart, Chakkaraparambu, Priyadarshini Road, Vennala, Kochi, Ernakulam, Kerala - 682028',
          href: 'https://maps.app.goo.gl/865Bo5MqSnSiU1LDA',
          external: true,
        },
      ],
      [
        { value: '+91 94464 60533', href: 'tel:+919446460533', icon: 'fa-phone' },
      ],
    ],
  },
  {
    icon: 'fa-map-marker',
    label: 'Delhi Office',
    rows: [
      [
        {
          value: 'E-518, 1st Floor, Kocchar Plaza, Block E, Sector 7, Near Ramphal Chowk, Dwarka, New Delhi – 110075',
          href: 'https://www.google.com/maps/search/?api=1&query=E-518%2C+Kocchar+Plaza%2C+Block+E%2C+Sector+7%2C+Ramphal+Chowk%2C+Dwarka%2C+New+Delhi+110075',
          external: true,
        },
      ],
      [
        { value: '+91 70116 28153', href: 'tel:+917011628153', icon: 'fa-phone' },
        { value: '+91 98993 32931', href: 'tel:+919899332931', icon: 'fa-phone' },
      ],
    ],
  },
  {
    icon: 'fa-phone',
    label: 'Reach Us',
    rows: [
      [
        { value: '+91 94464 60533', href: 'tel:+919446460533', icon: 'fa-phone' },
        { value: '+91 70116 28153', href: 'tel:+917011628153', icon: 'fa-phone' },
        { value: '+91 98993 32931', href: 'tel:+919899332931', icon: 'fa-phone' },
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
    href: 'https://www.instagram.com/storybookholidays/',
    icon: 'fa-instagram',
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/ExploreTheUntoldStories',
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
  const { region, content } = useRegionContent();
  const footer = React.useMemo(
    () => resolveFooterContent(region, content?.footer),
    [region, content]
  );
  const showThemes = footer.themes.links.length > 0;
  const telHref = `tel:${footer.service.phone.replace(/[^+\d]/g, '')}`;

  return (
    <footer className="site-footer">
      <div className="container">


        <div className="footer-cta-card">
          <div className="footer-cta-copy">
            <p className="footer-kicker">Ready for your next escape?</p>
            <h2>{footer.cta.title}</h2>
            <p className="footer-cta-note">{footer.cta.note}</p>
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
        <div className={`container footer-grid${showThemes ? ' footer-grid-themes' : ''}`}>
          <div className="widget footer-brand footer-panel">
            <img
              src="/assets/images/logo/logo.png"
              alt="Story Book Holidays"
              width="120"
              height="72"
              className="logo"
            />
            <p className="footer-panel-label">{footer.brand.label}</p>
            <h3 className="widget-title">{footer.brand.heading}</h3>
            <p>{footer.brand.description}</p>
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
            <p className="footer-panel-label">{footer.explore.label}</p>
            <h3 className="widget-title">{footer.explore.heading}</h3>
            <ul className="list-arrow footer-links">
              {footer.explore.links.map((link, index) => (
                <li key={`${link.href}-${index}`}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {showThemes ? (
            <div className="widget footer-panel">
              <p className="footer-panel-label">{footer.themes.label}</p>
              <h3 className="widget-title">{footer.themes.heading}</h3>
              <ul className="list-arrow footer-links">
                {footer.themes.links.map((link, index) => (
                  <li key={`${link.href}-${index}`}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="widget widget-customer-info footer-panel">
            <p className="footer-panel-label">{footer.service.label}</p>
            <h3 className="widget-title">{footer.service.heading}</h3>
            <div className="cs-info">
              <p className="footer-panel-copy">{footer.service.description}</p>
              <p className="footer-contact-stack">
                <a href={telHref}>{footer.service.phone}</a>
                <a href={`mailto:${footer.service.email}`}>{footer.service.email}</a>
              </p>
              <div className="footer-support-points footer-support-points-soft">
                {footer.service.supportPoints.map((point, index) => (
                  <span key={`${point}-${index}`}>{point}</span>
                ))}
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
              <a href="/home">{footer.bottom.title}</a>
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
                          {row.map((line) => {
                            const lineProps = line.external
                              ? { target: '_blank', rel: 'noreferrer' }
                              : {};
                            return (
                              <a
                                key={line.href}
                                href={line.href}
                                className="contact-line"
                                {...lineProps}
                              >
                                {line.icon ? (
                                  <i className={`fa ${line.icon} contact-line-icon`} />
                                ) : null}
                                <span className="contact-value">{line.value}</span>
                              </a>
                            );
                          })}
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
