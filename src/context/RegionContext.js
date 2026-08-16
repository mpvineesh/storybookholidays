import React from 'react';
import { getRegionContent } from '../services/regionContentApi';
import { getRegions } from '../services/regionsApi';
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
  regionConfigs: [],
});

export function RegionProvider({ children }) {
  const [region, setRegionState] = React.useState(DEFAULT_REGION);
  const [content, setContent] = React.useState(() => defaultContentFor(DEFAULT_REGION));
  const [regionConfigs, setRegionConfigs] = React.useState(() =>
    REGIONS.map((entry) => ({ region: entry, title: entry, slug: entry.toLowerCase() }))
  );
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const stored = getStoredRegion();
    if (stored !== region) {
      setRegionState(stored);
    }
    return subscribeToRegionChange((next) => {
      setRegionState(next);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    let isMounted = true;

    getRegions()
      .then((response) => {
        if (!isMounted) return;
        const fetchedRegions = (response.data || []).filter((entry) => entry.region);
        if (fetchedRegions.length > 0) {
          setRegionConfigs(fetchedRegions);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setRegionConfigs(
          REGIONS.map((entry) => ({ region: entry, title: entry, slug: entry.toLowerCase() }))
        );
      });

    return () => {
      isMounted = false;
    };
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
    if (!next) return;
    setStoredRegion(next);
    setRegionState(next);
  }, []);

  const value = React.useMemo(
    () => ({
      region,
      content,
      isLoading,
      error,
      setRegion,
      regions: regionConfigs.map((entry) => entry.region),
      regionConfigs,
    }),
    [region, content, isLoading, error, setRegion, regionConfigs]
  );

  return <RegionContext.Provider value={value}>{children}</RegionContext.Provider>;
}

export const useRegionContent = () => React.useContext(RegionContext);
