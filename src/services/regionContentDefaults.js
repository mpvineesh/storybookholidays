const KERALA_DEFAULTS = {
  region: 'Kerala',
  header: { tagline: 'Curated Kerala journeys with soul' },
  hero: {
    eyebrow: 'Curated Kerala travel, beautifully planned',
    title: 'Turn every holiday into a story worth retelling.',
    description:
      'Explore backwaters, hill stations, beaches, and cultural landmarks with a travel team that shapes each itinerary around comfort, beauty, and memorable local experiences.',
    badges: ['Private escapes', 'Trusted local expertise', 'Backwaters to beaches'],
    slides: [
      {
        title: 'Kumarakom',
        subtitle: 'Lakeside mornings and unhurried backwater stays',
        description:
          'Ease into Kerala with premium houseboats, village canals, and soft golden evenings beside Vembanad Lake.',
        imageUrl: '/assets/images/slide-kumarakam.jpg',
        highlights: ['Luxury houseboats', 'Bird sanctuary', 'Slow travel'],
      },
      {
        title: 'Munnar',
        subtitle: 'Mist, tea gardens, and scenic mountain roads',
        description:
          'Trade city noise for cool air, rolling plantations, and lookouts that make every drive feel cinematic.',
        imageUrl: '/assets/images/slide7.jpg',
        highlights: ['Tea estates', 'Waterfalls', 'Hill retreats'],
      },
      {
        title: 'Athirappilly',
        subtitle: 'Rainforest routes and Kerala’s dramatic waterfall escape',
        description:
          'Layer forest stays, monsoon greens, and the roar of iconic falls into a stop that feels both wild and restorative.',
        imageUrl: '/assets/images/slide-athirappally.jpg',
        highlights: ['Waterfall views', 'Rainforest drives', 'Nature stays'],
      },
      {
        title: 'Kovalam',
        subtitle: 'Sea breezes, wellness, and sunset beach time',
        description:
          'Balance shorefront relaxation with Ayurvedic comforts and leisurely evenings along Kerala’s most loved coast.',
        imageUrl: '/assets/images/slide4.jpg',
        highlights: ['Beach resorts', 'Ayurveda', 'Ocean sunsets'],
      },
    ],
  },
  planning: {
    points: [
      'Tailor-made itineraries across Kerala',
      'Trusted driver-guides and smooth transfers',
      'Handpicked stays, cruises, and local experiences',
    ],
  },
  destinations: { kicker: 'Destination highlights', title: 'Three moods of Kerala, one unforgettable holiday.', items: [] },
  packagesSection: { kicker: 'Best-selling itineraries', title: 'Holiday packages designed to feel effortless.' },
  experience: { kicker: 'Designed around your travel style', title: 'A more attractive trip starts with better pacing.', themes: [] },
  stats: [
    { value: '7+', label: 'Curated Kerala packages' },
    { value: '100%', label: 'Private planning support' },
    { value: '2', label: 'Office locations in Kerala' },
    { value: '365', label: 'Days to start your next story' },
  ],
};

const INDIA_DEFAULTS = {
  region: 'India',
  header: { tagline: 'Curated India journeys with soul' },
  hero: {
    eyebrow: 'Pan-India holidays, beautifully planned',
    title: 'Discover Incredible India, one story at a time.',
    description:
      'From the Himalayas to the heritage cities and coastal getaways — we craft pan-India journeys with the same care and pacing that shapes every Story Book Holiday.',
    badges: ['Heritage circuits', 'Mountain escapes', 'Coastal comfort'],
    slides: [
      {
        title: 'Incredible India',
        subtitle: 'Pan-India journeys crafted with care',
        description:
          'Coming soon — handpicked routes across India. Reach out on WhatsApp to start planning a custom itinerary today.',
        imageUrl: '/assets/images/india-card.jpg',
        highlights: ['Custom routes', 'Trusted partners', 'Private planning'],
      },
    ],
  },
  planning: {
    points: [
      'Tailor-made itineraries across India',
      'Trusted partners in every region',
      'Handpicked stays and unique experiences',
    ],
  },
  destinations: { kicker: 'Destination highlights', title: 'Discover India.', items: [] },
  packagesSection: { kicker: 'Best-selling itineraries', title: 'India holiday packages designed around you.' },
  experience: { kicker: 'Designed around your travel style', title: 'A more attractive trip starts with better pacing.', themes: [] },
  stats: [],
};

const WORLD_DEFAULTS = {
  region: 'World',
  header: { tagline: 'Curated journeys beyond borders' },
  hero: {
    eyebrow: 'Beyond borders, beautifully planned',
    title: 'Travel the world with a planning team that knows you.',
    description:
      'Handpicked international escapes — from island retreats to cultural capitals — designed around your pace and preferences.',
    badges: ['Island retreats', 'Cultural capitals', 'Bespoke routes'],
    slides: [
      {
        title: 'Beyond Borders',
        subtitle: 'Handpicked international escapes',
        description:
          'Coming soon — international itineraries. Reach out on WhatsApp to start planning your next overseas trip.',
        imageUrl: '/assets/images/world-card.jpg',
        highlights: ['Custom routes', 'Trusted partners', 'Private planning'],
      },
    ],
  },
  planning: {
    points: [
      'Tailor-made international itineraries',
      'Trusted overseas partners',
      'Handpicked stays and unique experiences',
    ],
  },
  destinations: { kicker: 'Destination highlights', title: 'Travel the world.', items: [] },
  packagesSection: { kicker: 'Best-selling itineraries', title: 'International holiday packages designed around you.' },
  experience: { kicker: 'Designed around your travel style', title: 'A more attractive trip starts with better pacing.', themes: [] },
  stats: [],
};

const DEFAULTS_BY_REGION = {
  Kerala: KERALA_DEFAULTS,
  India: INDIA_DEFAULTS,
  World: WORLD_DEFAULTS,
};

export const defaultContentFor = (region) => DEFAULTS_BY_REGION[region] || KERALA_DEFAULTS;
