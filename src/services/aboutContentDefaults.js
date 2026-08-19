export const defaultAboutContent = {
  hero: {
    eyebrow: 'About Story Book Holidays',
    title: 'Curated journeys, shaped by a lifetime of loving travel.',
    lead:
      'A Kerala-rooted travel studio that designs holidays the way you’d want a close friend to plan them — warm, detailed, and quietly luxurious. Share your vision with our travel specialists, and we’ll manage the rest.',
    backgroundImageUrl: '/assets/images/slide-kumarakam.jpg',
    stats: [
      { value: '15+', label: 'Years in inbound travel' },
      { value: '40+', label: 'Curated experiences' },
      { value: '24/7', label: 'Dedicated trip support' },
    ],
  },
  story: {
    kicker: 'Our Story',
    title: 'From a guest house in Hyderabad to itineraries across Kerala and beyond.',
    paragraphs: [
      'As an ardent and passionate travel lover, I, Justin Jose, have always loved the aspects and prospects of tourism. To help people around the world explore and discover this marvelous creation called earth has always fascinated me to the core. This desire and passion has driven me to where I am today.',
      'After a bachelor’s degree in Electronics from Hyderabad I joined the hospitality sector as a Unit Manager in a guest house — almost unexpectedly. Guests there would light up when I said I hail from Kerala. They asked me about everything from tourist places to festivals, climate and people. Quite often the conversations stretched past closing hours, and most of them ended in a quiet wish: to visit Kerala one day.',
      'A wonderful couple, Mr. and Mrs. Podas from Germany, who visited India every year, asked if they could come to my hometown Bekal — beaches, forts, slow village life. That trip was the first complete itinerary I designed: hotel, food, transport, beach mornings, fort walks, temples and churches. Their happiness told me this was more than a job. I joined Mar Ivanios College, Trivandrum, for a Post Graduation in Tourism, took up a front-office role at a leading 3-star hotel, and later worked with the Kerala Tourism Information Centre — learning the state, its people and what travelers really look for.',
      'After my Post Graduation I joined a 5-star luxury resort in Kumarakom as Activity Coordinator, taking guests into interior villages for sunsets and slow afternoons. A stint with an inbound tour operator in Delhi, sending Australian and New Zealand travellers across India, sharpened the craft further. A move to Calicut to source travellers from Dubai, Qatar, Abu Dhabi and Muscat finally lit the spark — to start an agency focused on inbound tourism to God’s own country, Kerala, for travellers from every corner of India and the world.',
    ],
    signatureName: '— Justin Jose',
    signatureRole: 'Founder, Story Book Holidays',
    glanceKicker: 'At a glance',
    glance: [
      {
        title: 'Based in Kerala',
        description: 'Designing inbound and outbound holidays since day one.',
      },
      {
        title: 'Founder-led',
        description: 'Itineraries personally reviewed by Justin and his team.',
      },
      {
        title: 'Network-first',
        description: 'Trusted ground partners across every region we operate in.',
      },
      {
        title: 'Slow, considered planning',
        description: 'We map pacing, not just destinations.',
      },
    ],
  },
  mission: {
    kicker: 'What guides us',
    title: 'Mission & vision.',
    cards: [
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
    ],
  },
  whyBook: {
    kicker: 'Why book with us',
    title: 'The reasons travelers choose Story Book Holidays.',
    cards: [
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
    ],
  },
  services: {
    kicker: 'Our Services',
    title: 'From luxury resort stays to fully curated holiday packages.',
    description:
      'We handle every detail of your journey — flights and transfers, hand-picked stays, on-ground experiences, and the small comforts in between. Simply share your vision with our travel specialists, and we’ll manage the rest.',
    items: [
      'Bespoke holiday packages across Kerala, India and the world',
      'Luxury resort and boutique stay curation',
      'Honeymoon, family, group and solo itineraries',
      'Private transport, guides and on-ground coordination',
    ],
  },
  guarantee: {
    kicker: 'Satisfaction guarantee',
    title: 'Your peace of mind is our priority.',
    body:
      'We are committed to providing a seamless experience from the moment you book until you return home. Have questions? Reach out to our team — we’re here to make sure you travel with confidence for years to come.',
  },
};

const mergeSection = (fallback, incoming, arrayKeys = []) => {
  const merged = { ...fallback, ...(incoming || {}) };
  arrayKeys.forEach((key) => {
    const fetched = incoming?.[key];
    merged[key] = Array.isArray(fetched) && fetched.length > 0 ? fetched : fallback[key];
  });
  return merged;
};

export const mergeAboutContent = (incoming) => ({
  hero: mergeSection(defaultAboutContent.hero, incoming?.hero, ['stats']),
  story: mergeSection(defaultAboutContent.story, incoming?.story, ['paragraphs', 'glance']),
  mission: mergeSection(defaultAboutContent.mission, incoming?.mission, ['cards']),
  whyBook: mergeSection(defaultAboutContent.whyBook, incoming?.whyBook, ['cards']),
  services: mergeSection(defaultAboutContent.services, incoming?.services, ['items']),
  guarantee: mergeSection(defaultAboutContent.guarantee, incoming?.guarantee),
});
