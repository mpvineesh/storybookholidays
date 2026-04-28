import React from 'react';
import { getRegionContent } from '../services/regionContentApi';
import { defaultContentFor } from '../services/regionContentDefaults';

const RegionContext = React.createContext({
  region: 'Kerala',
  content: defaultContentFor('Kerala'),
  isLoading: false,
  error: '',
});

export function RegionProvider({ region = 'Kerala', children }) {
  const [content, setContent] = React.useState(() => defaultContentFor(region));
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    let isMounted = true;
    setContent(defaultContentFor(region));
    setIsLoading(true);
    setError('');

    getRegionContent(region)
      .then((response) => {
        if (!isMounted) return;
        const fetched = response.data || {};
        const fallback = defaultContentFor(region);
        setContent({ ...fallback, ...fetched });
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
