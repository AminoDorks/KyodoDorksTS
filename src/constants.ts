// Basic

export const API_URL = 'https://api.kyodo.app';
export const WS_URL = 'wss://ws.kyodo.app';
export const APP_URL = 'https://kyodo.app';
export const SIGNATURE_KEY = '9d93933f-7864-4872-96b2-9541ac03cf6c';
export const CURRENT_VERSION = '1.1.1';
export const TELEGRAM_URL = 'https://t.me/aminodorks';
export const WEBSOCKET_RECONNECT_TIME = 450000;

// Structures

export const KYODO_API_HEADERS = {
    'Accept': 'application/json, text/plain, */*',
    'app-id': 'android app.kyodo.android/4.163.819',
    'app-version': '4.163.819',
    'Connection': 'Keep-Alive',
    'Content-Type': 'application/json',
    'device-language': 'ru',
    'device-timezone': 'Europe/Moscow',
    'Host': 'api.kyodo.app',
    'User-Agent': 'kyodo.dorks/1.0.0 (https://github.com/thatcelt/KyodoDorksTS)'
};

export const KYODO_APP_HEADERS = {
    'Accept': 'application/json, text/plain, */*',
    'Connection': 'Keep-Alive',
    'Content-Type': 'application/json',
    'Host': 'kyodo.app',
    'User-Agent': 'kyodo.dorks/1.0.0 (https://github.com/thatcelt/KyodoDorksTS)',
    'Origin': 'https://kyodo.app',
    'Referer': 'https://kyodo.app/'
};

export const SOCKET_TOPICS = {
    '1_0': 'message',
    '1_2': 'image',
    '1_5': 'memberJoin',
    '1_6': 'memberLeave',
    '1_16': 'sticker',
};