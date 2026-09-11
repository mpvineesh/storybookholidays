// Fallback footer copy per region. Used until the region-content API responds
// and to fill any field an admin left blank.
const buildFooterDefaults = (region) => {
  const isWorld = region === 'World';
  const journeyLabel = isWorld ? 'Global journeys' : `${region} journeys`;
  const scope = isWorld ? 'destinations' : region;

  return {
    cta: {
      title: isWorld
        ? 'Let’s design an international holiday that feels personal from day one.'
        : `Let’s design ${region === 'India' ? 'an India' : `a ${region}`} holiday that feels personal from day one.`,
      note: isWorld
        ? 'Share your pace, favorite experiences, and travel dates. We will shape a global route that feels thoughtful from the first call.'
        : `Share your pace, favorite experiences, and travel dates. We will shape a route across ${region} that feels thoughtful from the first call.`,
    },
    brand: {
      label: 'Story Book Holidays',
      heading: `${journeyLabel} with warmth, pacing, and local insight.`,
      description:
        'We create travel stories that balance scenic highlights with comfort, cultural texture, and practical support all along the route.',
    },
    explore: {
      label: 'Explore',
      heading: 'Start with the essentials.',
      links: [
        { label: 'Journeys', href: '/packages' },
        { label: 'Chapters', href: '/destinations' },
        { label: 'Travel Tales', href: '/blog' },
        { label: 'Our Story', href: '/about' },
        { label: "Let's Talk", href: '/contact' },
      ],
    },
    themes: {
      label: 'Travel Themes',
      heading:
        region === 'Kerala'
          ? 'Choose the Kerala mood you want most.'
          : 'Choose the travel mood you want most.',
      links: [],
    },
    service: {
      label: 'Customer Service',
      heading: 'Real people, direct answers, and steady support.',
      description:
        'Quality service stays at the center of every itinerary, from your first enquiry to the final airport transfer home.',
      phone: '+91 94464 60533',
      email: 'info@storybookholidays.com',
      supportPoints: ['WhatsApp-first planning', 'Private family trips', `Support across ${scope}`],
    },
    bottom: {
      title: isWorld
        ? 'Explore untold stories from around the world.'
        : `Explore the untold stories of ${region}.`,
    },
  };
};

const pickText = (value, fallback) =>
  typeof value === 'string' && value.trim() ? value : fallback;

const pickList = (value, fallback) => (Array.isArray(value) && value.length > 0 ? value : fallback);

const cleanLinks = (links) =>
  (Array.isArray(links) ? links : []).filter(
    (link) => link && typeof link.label === 'string' && link.label.trim() && link.href
  );

// Deep-merge stored footer content over the region defaults. Blank strings and
// empty lists fall back to the defaults, except theme links, where an empty
// list is a deliberate "hide this panel".
export const resolveFooterContent = (region, stored) => {
  const base = buildFooterDefaults(region);
  const source = stored && typeof stored === 'object' ? stored : {};

  return {
    cta: {
      title: pickText(source.cta?.title, base.cta.title),
      note: pickText(source.cta?.note, base.cta.note),
    },
    brand: {
      label: pickText(source.brand?.label, base.brand.label),
      heading: pickText(source.brand?.heading, base.brand.heading),
      description: pickText(source.brand?.description, base.brand.description),
    },
    explore: {
      label: pickText(source.explore?.label, base.explore.label),
      heading: pickText(source.explore?.heading, base.explore.heading),
      links: pickList(cleanLinks(source.explore?.links), base.explore.links),
    },
    themes: {
      label: pickText(source.themes?.label, base.themes.label),
      heading: pickText(source.themes?.heading, base.themes.heading),
      links: cleanLinks(source.themes?.links),
    },
    service: {
      label: pickText(source.service?.label, base.service.label),
      heading: pickText(source.service?.heading, base.service.heading),
      description: pickText(source.service?.description, base.service.description),
      phone: pickText(source.service?.phone, base.service.phone),
      email: pickText(source.service?.email, base.service.email),
      supportPoints: pickList(
        (source.service?.supportPoints || []).filter((point) => point && point.trim()),
        base.service.supportPoints
      ),
    },
    bottom: {
      title: pickText(source.bottom?.title, base.bottom.title),
    },
  };
};

export default buildFooterDefaults;
