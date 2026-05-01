import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Story Book Holidays';
const SITE_URL = 'https://storybookholidays.com';
const DEFAULT_DESCRIPTION =
  'Curated Kerala, India, and international holiday packages — backwaters, hill escapes, beaches, Ayurveda, and bespoke travel planning by Story Book Holidays.';
const DEFAULT_IMAGE = `${SITE_URL}/assets/images/slide-athirappally.jpg`;
const TWITTER_HANDLE = '@storybookholiday';

const buildCanonical = (path) => {
  if (!path) {
    return SITE_URL;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`.replace(/\/$/, '') || SITE_URL;
};

const Seo = ({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  image = DEFAULT_IMAGE,
  type = 'website',
  noIndex = false,
  keywords,
  jsonLd,
  children,
}) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Curated Kerala Travel Experiences`;
  const canonical = buildCanonical(path);
  const robots = noIndex ? 'noindex, nofollow' : 'index, follow';

  return (
    <Helmet prioritizeSeoTags defer={false}>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonical} />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="en_IN" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {jsonLd ? (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      ) : null}

      {children}
    </Helmet>
  );
};

export const SITE = { name: SITE_NAME, url: SITE_URL, defaultImage: DEFAULT_IMAGE };

export default Seo;
