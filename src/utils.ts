import { join } from 'path';

// https://github.com/umijs/umi/blob/53f2ccb755844e8c6f34e9fdb51bf79d3f68414f/packages/utils/src/winPath.ts
function originWinPath(path: string) {
  const isExtendedLengthPath = /^\\\\\?\\/.test(path);
  if (isExtendedLengthPath) {
    return path;
  }
  return path.replace(/\\/g, '/');
}

export const winPath = (...args: string[]) => originWinPath(join(...args));