const KERALA_DEFAULTS = {
  region: "Kerala",
  header: {
    tagline: "Curated Kerala journeys with soul",
  },
  hero: {
    eyebrow: "Curated Kerala travel, beautifully planned",
    title: "Turn every holiday into a story worth retelling.",
    description:
      "Explore backwaters, hill stations, beaches, and cultural landmarks with a travel team that shapes each itinerary around comfort, beauty, and memorable local experiences.",
    badges: ["Private escapes", "Trusted local expertise", "Backwaters to beaches"],
    slides: [
      {
        title: "Kumarakom",
        subtitle: "Lakeside mornings and unhurried backwater stays",
        description:
          "Ease into Kerala with premium houseboats, village canals, and soft golden evenings beside Vembanad Lake.",
        imageUrl: "/assets/images/slide-kumarakam.jpg",
        highlights: ["Luxury houseboats", "Bird sanctuary", "Slow travel"],
      },
      {
        title: "Munnar",
        subtitle: "Mist, tea gardens, and scenic mountain roads",
        description:
          "Trade city noise for cool air, rolling plantations, and lookouts that make every drive feel cinematic.",
        imageUrl: "/assets/images/slide7.jpg",
        highlights: ["Tea estates", "Waterfalls", "Hill retreats"],
      },
      {
        title: "Athirappilly",
        subtitle: "Rainforest routes and Kerala’s dramatic waterfall escape",
        description:
          "Layer forest stays, monsoon greens, and the roar of iconic falls into a stop that feels both wild and restorative.",
        imageUrl: "/assets/images/slide-athirappally.jpg",
        highlights: ["Waterfall views", "Rainforest drives", "Nature stays"],
      },
      {
        title: "Kovalam",
        subtitle: "Sea breezes, wellness, and sunset beach time",
        description:
          "Balance shorefront relaxation with Ayurvedic comforts and leisurely evenings along Kerala’s most loved coast.",
        imageUrl: "/assets/images/slide4.jpg",
        highlights: ["Beach resorts", "Ayurveda", "Ocean sunsets"],
      },
    ],
  },
  planning: {
    points: [
      "Tailor-made itineraries across Kerala",
      "Trusted driver-guides and smooth transfers",
      "Handpicked stays, cruises, and local experiences",
    ],
  },
  destinations: {
    kicker: "Destination highlights",
    title: "Three moods of Kerala, one unforgettable holiday.",
    items: [
      {
        title: "Munnar",
        subtitle: "Tea gardens and cloud-kissed viewpoints",
        description:
          "Wake up to rolling plantations, cool mountain air, and slow scenic drives through Kerala’s most iconic hill escape.",
        imageUrl: "/assets/images/slide7.jpg",
        highlights: ["Tea estates", "Waterfalls", "Romantic stays"],
      },
      {
        title: "Alleppey",
        subtitle: "Backwater cruises with golden sunsets",
        description:
          "Glide past village canals, coconut groves, and lakeside life on curated houseboat experiences built for pure calm.",
        imageUrl: "/assets/images/slide-kumarakam.jpg",
        highlights: ["Houseboats", "Village trails", "Sunset decks"],
      },
      {
        title: "Kovalam",
        subtitle: "Beach days with wellness and culture",
        description:
          "Blend sea breezes, Ayurvedic indulgence, and easy coastal evenings in one of Kerala’s most loved shoreline escapes.",
        imageUrl: "/assets/images/slide4.jpg",
        highlights: ["Beach resorts", "Ayurveda", "Ocean views"],
      },
    ],
  },
  packagesSection: {
    kicker: "Best-selling itineraries",
    title: "Holiday packages designed to feel effortless.",
  },
  experience: {
    kicker: "Designed around your travel style",
    title: "A more attractive trip starts with better pacing.",
    themes: [
      {
        label: "Slow Luxury",
        title: "Thoughtful journeys with space to breathe",
        description:
          "We balance signature sights with quiet moments so your holiday feels restorative, not rushed.",
      },
      {
        label: "Local Insight",
        title: "Kerala through stories, food, and culture",
        description:
          "From village life to living traditions, each route is shaped with local knowledge that adds depth to every stop.",
      },
      {
        label: "Seamless Support",
        title: "Everything arranged before you arrive",
        description:
          "Accommodation, transport, and activity planning come together in one coordinated experience from start to finish.",
      },
    ],
  },
  stats: [
    { value: "7+", label: "Curated Kerala packages" },
    { value: "100%", label: "Private planning support" },
    { value: "2", label: "Office locations in Kerala" },
    { value: "365", label: "Days to start your next story" },
  ],
};

const buildDefaultsFor = (region) => {
  if (region === "Kerala") {
    return KERALA_DEFAULTS;
  }

  return {
    ...KERALA_DEFAULTS,
    region,
    header: { tagline: `Curated ${region} journeys with soul` },
    hero: {
      ...KERALA_DEFAULTS.hero,
      eyebrow: `Curated ${region} travel, beautifully planned`,
    },
    destinations: {
      ...KERALA_DEFAULTS.destinations,
      title: `Discover ${region}.`,
      items: [],
    },
    stats: [],
  };
};

module.exports = {
  buildDefaultsFor,
};
