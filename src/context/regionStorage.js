export const REGIONS = ['Kerala', 'India', 'World'];
export const DEFAULT_REGION = 'Kerala';

const STORAGE_KEY = 'sbh_active_region';
const CHANGE_EVENT = 'sbh:region-changed';

export const getStoredRegion = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_REGION;
  }

  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return REGIONS.includes(value) ? value : DEFAULT_REGION;
  } catch (_error) {
    return DEFAULT_REGION;
  }
};

export const setStoredRegion = (region) => {
  if (typeof window === 'undefined' || !REGIONS.includes(region)) {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, region);
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: region }));
  } catch (_error) {
    /* swallow — storage may be disabled */
  }
};

export const subscribeToRegionChange = (handler) => {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const onCustom = (event) => handler(event.detail);
  const onStorage = (event) => {
    if (event.key === STORAGE_KEY) {
      handler(getStoredRegion());
    }
  };

  window.addEventListener(CHANGE_EVENT, onCustom);
  window.addEventListener('storage', onStorage);

  return () => {
    window.removeEventListener(CHANGE_EVENT, onCustom);
    window.removeEventListener('storage', onStorage);
  };
};
