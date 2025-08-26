<div align="center">
    <h1>KyodoDorksTS</h1>
    <a href="https://t.me/aminodorks"><img src="https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram"></a>
    <a href="https://www.npmjs.com/package/kyodo.dorks"><img src="https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white" alt="NPM"></a>
</div>
<div align="center">
    <img src="https://img.shields.io/npm/dm/kyodo.dorks" alt="Downloads">
    <img src="https://img.shields.io/npm/v/kyodo.dorks.svg" alt="Version">
    <h2>TypeScript API wrapper for Kyodo: Communities & Chats</h2>
</div>

## Table of Contents
-----------------

* [Features](#features)
* [Getting Started](#getting-started)
* [Usage](#usage)
* [Contributing](#contributing)
* [License](#license)

## Features
--------

KyodoDorks contains a many features
* API methods for Kyodo
* Supporting verifier methods
* Bypass of all current signatures
* Active developer, that will update it :)

## Getting Started
---------------

To get started with AminoDorks, follow these steps:
1. Initialize npm package: `npm init`
2. Install TypeScript: `npm i -g typescript`
3. Initialize TypeScript config and configure it: `tsc --init`
4. Install package via npm: `npm i kyodo.dorks`

## Usage
-----

### Basic authorization

```typescript
import { KyodoDorks } from 'kyodo.dorks';

const kyodoDorks = new KyodoDorks();

(async () => {
    await kyodoDorks.security.authorize('email', 'password', 'device-id');
    console.log(`Logged as ${kyodoDorks.security.account.user.nickname}`);
})();
```

### Simple login without device (with verifying)

```typescript
import { KyodoDorks, KyodoDorksAPIError } from 'kyodo.dorks';

const kyodoDorks = new KyodoDorks();

(async () => {
    try {
        await kyodoDorks.security.authorize('email', 'password');
    } catch (error) {
        if (error instanceof KyodoDorksAPIError && error.code == 401) {
            await kyodoDorks.security.verifyDevice(
                'raaaaaahceltisgod',
                await RL_INTERFACE.question('token: '),
                await RL_INTERFACE.question('account id: '),
            );
        };
    } finally {
        await kyodoDorks.security.authorize('email', 'password');
    };
})();
```

## Contributing
------------

Contributions are welcome! Please submit a pull request with your changes.

## License
-------

AminoDorksTS is licensed under the MIT License. See LICENSE for more information.