import prettifier from 'pino-pretty';
import { pino, type Logger } from 'pino';

export const configureLogger = (enabled: boolean): Logger =>
  pino(
    {
      enabled,
    },
    prettifier({ colorize: true, sync: true })
  );
