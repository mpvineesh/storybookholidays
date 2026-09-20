// First-run bootstrap only: these mirror the testimonials that were
// hardcoded on the home page before they became admin-managed.
const SITE_ASSET_BASE_URL = "https://storybookholidays.com/assets/images";

const DEFAULT_TESTIMONIALS = [
  {
    name: "Anand",
    role: "Family Traveler",
    quote:
      "They delivered the service word by word as they told me. I will definitely travel with Story Book Holidays again.",
    imagePath: `${SITE_ASSET_BASE_URL}/anand.jpeg`,
    sortOrder: 1,
  },
  {
    name: "Eraz",
    role: "Holiday Traveler",
    quote:
      "The hotel selection was excellent and the vehicle was maintained beautifully. Our family trip felt easy and memorable throughout.",
    imagePath: `${SITE_ASSET_BASE_URL}/testimonial1.jpeg`,
    sortOrder: 2,
  },
  {
    name: "Gregory Vian",
    role: "Traveler from Australia",
    quote:
      "The whole trip turned out to be a pleasant experience and quite economical. The accommodation choices were especially impressive.",
    imagePath: `${SITE_ASSET_BASE_URL}/gregory.jpeg`,
    sortOrder: 3,
  },
  {
    name: "Vinay A Singh",
    role: "Group Traveler",
    quote:
      "We enjoyed our tour in Kerala with Story Book Holidays, especially the coordination and support in every city.",
    imagePath: `${SITE_ASSET_BASE_URL}/vinay.jpeg`,
    sortOrder: 4,
  },
].map((entry) => ({ ...entry, region: "", isActive: true }));

module.exports = {
  DEFAULT_TESTIMONIALS,
};
