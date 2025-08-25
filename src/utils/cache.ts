import { writeFileSync, readFileSync, existsSync } from 'fs';

import { CachedAccount } from '../public';

class CacheManager {
    private cachedUsers: Record<string, CachedAccount> = {};

    constructor() {
        if (existsSync('cache.json')) this.cachedUsers = JSON.parse(readFileSync('cache.json').toString());
    };

    private __saveCache = (): void => {
        writeFileSync('cache.json', JSON.stringify(this.cachedUsers, null, 4));
    };

    public addToCache = (credentials: string, user: CachedAccount): CachedAccount => {
        this.cachedUsers[credentials] = user;
        this.__saveCache();

        return this.cachedUsers[credentials];
    };

    public getFromCache = (credentials: string): CachedAccount => {
        return this.cachedUsers[credentials]
    };

    public removeFromCache = (credentials: string): void => {
        // i don't care
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete this.cachedUsers[credentials]
        this.__saveCache();
    };
};

export default new CacheManager();
