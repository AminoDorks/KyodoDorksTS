import { exec } from 'child_process';
import { CURRENT_VERSION, TELEGRAM_URL } from './constants';

export { KyodoDorks } from './core/kyododorks';
export { KyodoDorksAPIError } from './utils/exceptions';


console.log(`\x1b[34mVisit our community:\x1b[32m ${TELEGRAM_URL}\x1b[0m`);
exec('npm view kyodo.dorks version', (error, stdout, stderr) => {
    if (error) {
        console.error(`Error retrieving npm package version for kyodo.dorks: ${stderr.trim()}`);
        return;
    };
    const installedVersion = stdout.trim();

    if (installedVersion !== CURRENT_VERSION) {
        console.log(`\x1b[33mYou're using outdated version. kyodo.dorks v${installedVersion} is available.\x1b[0m`);
    };
});