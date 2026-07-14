import type { Headers } from './types/http';

export const BASE_URL = 'https://api.kina.gg/v2';

export const BASE_HEADERS: Headers = {
  accept: 'application/json, text/plain, */*',
  'Accept-Encoding': 'gzip',
  'app-id': 'android app.kyodo.android/5.193.890',
  'app-os': 'android',
  'app-version': '5.193.890',
  Connection: 'Keep-Alive',
  'Content-Type': 'application/json',
  'device-language': 'en',
  'device-region': 'en',
  'device-timezone': 'Europe/Moscow',
  Host: 'api.kina.gg',
  'User-Agent': 'okhttp/4.12.0',
};

export const CACHE_RELATIVE_PATH = './cache.json';
