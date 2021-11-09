import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { logger } from './environements';

const mv = promisify(fs.rename);

type DownloadFileSort = Record<
  string,
  { path: string; extensions: string[]; files: string[] }
>;

const downloadFileSort: DownloadFileSort = {
  images: {
    path: '/Users/melvynmalherbe/Downloads/images',
    extensions: ['jpeg', 'jpg', 'png', 'heic', 'webp'],
    files: [],
  },
  vector: {
    path: '/Users/melvynmalherbe/Downloads/svg',
    extensions: ['svg'],
    files: [],
  },
  gif: {
    path: '/Users/melvynmalherbe/Downloads/gif',
    extensions: ['gif'],
    files: [],
  },
  documents: {
    path: '/Users/melvynmalherbe/Downloads/pdf',
    extensions: ['pdf'],
    files: [],
  },
  other: {
    path: '/Users/melvynmalherbe/Downloads/other',
    extensions: ['zip', 'rtf', 'txt', 'xlsx', 'fig', 'dmg', 'json'],
    files: [],
  },
};

const readDownloadDir = (downloadPath: string) =>
  new Promise((resolve) => {
    fs.readdir(downloadPath, (err, files) => {
      if (err) return;

      files.forEach((file) => {
        logger.debug(`Read file: ${file}`);
        if (!file.includes('.')) return;

        const extension = file.split('.').pop().toLowerCase();

        if (!extension) return;

        Object.values(downloadFileSort).forEach((value) => {
          if (value.extensions.includes(extension)) {
            logger.debug(`Add file into ${value.path}`);
            value.files.push(file);
          }
        });
      });

      resolve('');
    });
  });

const main = async () => {
  const downloadPath = path.resolve('/Users/melvynmalherbe/Downloads');
  logger.info(`Get the downloadPath: ${downloadPath}`);

  await readDownloadDir(downloadPath);
  logger.info('Finish read download folder');

  logger.info('Start move files into correct folder.');
  Object.values(downloadFileSort).forEach((value) => {
    value.files.forEach((file) => {
      try {
        mv(`${downloadPath}/${file}`, `${value.path}/${file}`);
      } catch (e: unknown) {
        logger.error(e);
      }
    });
  });
};

main();
