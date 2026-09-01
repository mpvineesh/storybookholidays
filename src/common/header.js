import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useRegionContent } from '../context/RegionContext';

const navItems = [
  { label: 'The Story Begins', href: '/home' },
  { label: 'Our Story', href: '/about' },
  { label: 'Journeys', href: '/packages' },
  { label: 'Chapters', href: '/destinations' },
  { label: 'Travel Tales', href: '/blog' },
  { label: "Let's Talk", href: '/contact' },
];

function Header(props) {
  const location = useLocation();
  const history = useHistory();
  const { content, region, regions, regionConfigs, setRegion } = useRegionContent();
  const tagline = (content.header && content.header.tagline) || 'Curated Kerala journeys with soul';
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isRegionMenuOpen, setIsRegionMenuOpen] = React.useState(false);
  const regionMenuRef = React.useRef(null);
  React.useEffect(() => {
    setIsMenuOpen(false);
    setIsRegionMenuOpen(false);
  }, [location.pathname]);

  const slugForRegion = React.useCallback(
    (name) => {
      const config = regionConfigs.find((entry) => entry.region === name);
      return (config && config.slug) || name.toLowerCase();
    },
    [regionConfigs]
  );

  // Region home pages ("/kerala", "/india", ...) derive their region from the
  // URL, so switching regions there must navigate — updating context alone
  // gets overridden by the route.
  const isRegionHomePath = React.useMemo(() => {
    const path = location.pathname.replace(/\/+$/, '') || '/';
    if (path === '/' || path === '/home') return true;
    const slug = path.slice(1);
    return regionConfigs.some(
      (entry) => ((entry.slug || entry.region.toLowerCase())) === slug
    );
  }, [location.pathname, regionConfigs]);

  const handleRegionSelect = (option) => {
    setRegion(option);
    setIsRegionMenuOpen(false);
    if (isRegionHomePath) {
      history.push(`/${slugForRegion(option)}`);
    }
  };

  React.useEffect(() => {
    if (!isRegionMenuOpen) return undefined;

    const handleClickOutside = (event) => {
      if (regionMenuRef.current && !regionMenuRef.current.contains(event.target)) {
        setIsRegionMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isRegionMenuOpen]);

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
              <li className="menu-social-row" aria-hidden="false">
                <a
                  href="https://www.instagram.com/storybookholidays/"
                  aria-label="Instagram"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="fa fa-instagram" />
                </a>
                <a
                  href="https://www.facebook.com/ExploreTheUntoldStories"
                  aria-label="Facebook"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="fa fa-facebook" />
                </a>
                <a
                  href="https://wa.me/919446460533?text=Hello%20Storybook%20Holidays!"
                  aria-label="WhatsApp"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="fa fa-whatsapp" />
                </a>
              </li>
            </ul>
          </nav>

          <div className="header-actions">
            <div className="region-switcher" ref={regionMenuRef}>
              <button
                type="button"
                className={`region-switcher-trigger ${isRegionMenuOpen ? 'is-open' : ''}`}
                onClick={() => setIsRegionMenuOpen((open) => !open)}
                aria-haspopup="listbox"
                aria-expanded={isRegionMenuOpen}
                aria-label={`Active region: ${region}. Click to change`}
              >
                <i className="fa fa-globe" aria-hidden="true" />
                <span className="region-switcher-label">{region}</span>
                <i
                  className={`fa fa-chevron-${isRegionMenuOpen ? 'up' : 'down'}`}
                  aria-hidden="true"
                />
              </button>
              {isRegionMenuOpen ? (
                <ul className="region-switcher-menu" role="listbox">
                  {regions.map((option) => (
                    <li
                      key={option}
                      role="option"
                      aria-selected={option === region}
                    >
                      <button
                        type="button"
                        className={`region-switcher-option ${
                          option === region ? 'is-active' : ''
                        }`}
                        onClick={() => handleRegionSelect(option)}
                      >
                        {option}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            <div className="social-links">
              <a
                href="https://www.instagram.com/storybookholidays/"
                className="instagram"
                aria-label="Instagram"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fa fa-instagram" />
              </a>
              <a
                href="https://www.facebook.com/ExploreTheUntoldStories"
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
          </div>
        </div>

        {props.parent ? (
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <a href="/home">The Story Begins</a>
            <span>{props.parent}</span>
          </nav>
        ) : null}
      </div>
    </header>
  );
}

export default Header;
