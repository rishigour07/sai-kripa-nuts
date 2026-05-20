const getStorage = () => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }

  return window.localStorage;
};

export const safeReadJSON = (key, fallback) => {
  const storage = getStorage();
  if (!storage) {
    return fallback;
  }

  try {
    const raw = storage.getItem(key);
    if (raw == null || raw === '') {
      return fallback;
    }

    return JSON.parse(raw);
  } catch (_error) {
    return fallback;
  }
};

export const safeWriteJSON = (key, value) => {
  const storage = getStorage();
  if (!storage) {
    return false;
  }

  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch (_error) {
    return false;
  }
};

export const safeReadString = (key, fallback = '') => {
  const storage = getStorage();
  if (!storage) {
    return fallback;
  }

  try {
    return storage.getItem(key) || fallback;
  } catch (_error) {
    return fallback;
  }
};

export const safeWriteString = (key, value) => {
  const storage = getStorage();
  if (!storage) {
    return false;
  }

  try {
    storage.setItem(key, value);
    return true;
  } catch (_error) {
    return false;
  }
};