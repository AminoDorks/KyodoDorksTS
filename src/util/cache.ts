import { write } from 'bun';
import debounce from 'lodash.debounce';

import { CACHE_RELATIVE_PATH } from '../constants';
import type { CachedUnit } from '../types/cache';

let cacheMap: Map<string, CachedUnit>;

const cacheSave = () => {
  write(CACHE_RELATIVE_PATH, JSON.stringify(Object.fromEntries(cacheMap), null, 4));
};

export const debouncedSave = debounce(() => {
  cacheSave();
}, 1000);

export const cacheSet = (key: string, unit: CachedUnit) => {
  cacheMap.set(key, unit);
  debouncedSave();
};

export const cacheRemove = (key: string) => {
  cacheMap.delete(key);
  debouncedSave();
};

export const cacheGet = (key: string) => {
  return cacheMap.get(key);
};

export const initCache = async () => {
  if (cacheMap) return cacheMap;

  cacheMap = new Map<string, CachedUnit>();

  try {
    const data = await Bun.file(CACHE_RELATIVE_PATH).json();
    if (data) cacheMap = new Map<string, CachedUnit>(Object.entries(data));
  } catch {}

  return cacheMap;
};
