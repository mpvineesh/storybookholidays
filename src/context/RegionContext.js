import React from 'react';
import { getRegionContent } from '../services/regionContentApi';
import { defaultContentFor } from '../services/regionContentDefaults';
import {
  DEFAULT_REGION,
  REGIONS,
  getStoredRegion,
  setStoredRegion,
  subscribeToRegionChange,
} from './regionStorage';

const RegionContext = React.createContext({
  region: DEFAULT_REGION,
  content: defaultContentFor(DEFAULT_REGION),
  isLoading: false,
  error: '',
  setRegion: () => {},
  regions: REGIONS,
});

export function RegionProvider({ children }) {
  const [region, setRegionState] = React.useState(getStoredRegion);
  const [content, setContent] = React.useState(() => defaultContentFor(getStoredRegion()));
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    return subscribeToRegionChange((next) => {
      setRegionState(next);
    });
  }, []);

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

  const setRegion = React.useCallback((next) => {
    if (!REGIONS.includes(next)) return;
    setStoredRegion(next);
    setRegionState(next);
  }, []);

  const value = React.useMemo(
    () => ({ region, content, isLoading, error, setRegion, regions: REGIONS }),
    [region, content, isLoading, error, setRegion]
  );

  return <RegionContext.Provider value={value}>{children}</RegionContext.Provider>;
}

export const useRegionContent = () => React.useContext(RegionContext);
