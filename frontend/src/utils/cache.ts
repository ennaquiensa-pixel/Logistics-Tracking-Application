type CacheEntry<T> = {
  data: T;
  time: number;
};

export const getFromCache = <T>(key: string, ttl: number): T | null => {
  const cached = localStorage.getItem(key);
  if (!cached) return null;

  const parsed: CacheEntry<T> = JSON.parse(cached);
  const isExpired = Date.now() - parsed.time > ttl;

  if (isExpired) {
    localStorage.removeItem(key);
    return null;
  }

  return parsed.data;
};

export const saveToCache = <T>(key: string, data: T) => {
  const entry: CacheEntry<T> = {
    data,
    time: Date.now(),
  };
  localStorage.setItem(key, JSON.stringify(entry));
};
