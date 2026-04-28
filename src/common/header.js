import React from 'react';
import { useLocation } from 'react-router-dom';
import { useRegionContent } from '../context/RegionContext';

const navItems = [
  { label: 'Home', href: '/home' },
  { label: 'About', href: '/about' },
  { label: 'Packages', href: '/packages' },
  { label: 'Destinations', href: '/destinations' },
  { label: 'Contact', href: '/contact' },
];

function Header(props) {
  const location = useLocation();
  const { content } = useRegionContent();
  const tagline = (content.header && content.header.tagline) || 'Curated Kerala journeys with soul';
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  React.useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className={!props.parent ? 'site-header site-header-home' : 'site-header'}>
      <div className="container">
        <div className="header-content">
          <div className="branding">
            <img
              src="/assets/images/logo/logo.png"
              alt="Story Book Holidays"
              width="120"
              height="72"
              className="logo"
              decoding="async"
              fetchpriority="high"
            />
            <div className="branding-copy">
              <h1 className="site-title">
                <a href="/home">Story Book Holidays</a>
              </h1>
              <small className="site-description">{tagline}</small>
            </div>
          </div>

          <nav className={`main-navigation nav ${isMenuOpen ? 'is-open' : ''}`}>
            <button
              type="button"
              className="menu-toggle"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label="Toggle navigation"
              aria-expanded={isMenuOpen}
            >
              <i className={`fa ${isMenuOpen ? 'fa-times' : 'fa-bars'}`} />
            </button>
            <ul className="menu">
              {navItems.map((item) => {
                const isActive =
                  item.href === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(item.href);

                return (
                  <li className={isActive ? 'current-menu-item' : ''} key={item.href}>
                    <a href={item.href}>{item.label}</a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="header-actions">
            <div className="social-links">
              <a
                href="https://instagram.com/story_book_holidays?igshid=xcyefcxv1e4m"
                className="instagram"
                aria-label="Instagram"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fa fa-instagram" />
              </a>
              <a
                href="https://www.facebook.com/"
                className="facebook"
                aria-label="Facebook"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fa fa-facebook" />
              </a>
              <a
                href="https://wa.me/919446460533?text=Hello%20Storybook%20Holidays!"
                className="whatsapp"
                aria-label="WhatsApp"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fa fa-whatsapp" />
              </a>
            </div>
            <a
              href="https://wa.me/919446460533?text=Hello%20Storybook%20Holidays!"
              className="button header-cta"
              target="_blank"
              rel="noreferrer"
            >
              Plan My Trip
            </a>
          </div>
        </div>

        {props.parent ? (
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <a href="/home">Home</a>
            <span>{props.parent}</span>
          </nav>
        ) : null}
      </div>
    </header>
  );
}

export default Header;
