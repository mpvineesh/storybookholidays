import React from 'react';
import { getRegionContent } from '../services/regionContentApi';

const EMPTY_CONTENT = {
  header: { tagline: '' },
  hero: { eyebrow: '', title: '', description: '', badges: [], slides: [] },
  planning: { points: [] },
  destinations: { kicker: '', title: '', items: [] },
  packagesSection: { kicker: '', title: '' },
  experience: { kicker: '', title: '', themes: [] },
  stats: [],
};

const RegionContext = React.createContext({
  region: 'Kerala',
  content: EMPTY_CONTENT,
  isLoading: false,
  error: '',
});

export function RegionProvider({ region = 'Kerala', children }) {
  const [content, setContent] = React.useState(EMPTY_CONTENT);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError('');

    getRegionContent(region)
      .then((response) => {
        if (!isMounted) return;
        setContent({ ...EMPTY_CONTENT, ...(response.data || {}) });
      })
      .catch((fetchError) => {
        if (!isMounted) return;
        setError(fetchError.message);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [region]);

  const value = React.useMemo(
    () => ({ region, content, isLoading, error }),
    [region, content, isLoading, error]
  );

  return <RegionContext.Provider value={value}>{children}</RegionContext.Provider>;
}

export const useRegionContent = () => React.useContext(RegionContext);
