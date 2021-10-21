import { Logger as BaseLogger } from 'tslog';

export const logLevels = ['fatal', 'error', 'warn', 'info', 'debug'] as const;

export type LogLevel = typeof logLevels[number];

export type Logger = {
  // eslint-disable-next-line no-unused-vars
  [Level in LogLevel]: (...arguments_: unknown[]) => void;
};

const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const logger: Logger = new BaseLogger({
  minLevel: 'debug',
  dateTimeTimezone: timezone,
  displayFilePath: 'hidden',
  displayFunctionName: false,
});
