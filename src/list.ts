import { winPath } from './utils';

const CWD = process.cwd();
const NODE_MODULES = winPath(CWD, 'node_modules');

const ENABLED_OUTPUT = process.env.CI ? false : String(
  process.env.ENABLED_OUTPUT
  ?? process.env.WITH_OUTPUT
  ?? process.env.ENABLE_OUTPUT
  ?? process.env.OUTPUT
  ?? process.env.O
  ?? false
).toLowerCase() !== 'false';

export default [
  // cache
  winPath(NODE_MODULES, '.cache'),

  // vite
  winPath(NODE_MODULES, '.vite'),

  // umi
  winPath(
    CWD,
    `.${process.env.FRAMEWORK_NAME || 'umi'}`,
    "**"
  ),

  // dumi
  winPath(CWD, '.dumi/tmp-*',),

  // test coverage
  winPath(CWD, '.coverage', '**'),

  // compile output
  ...(
    ENABLED_OUTPUT
      ? [
        winPath(CWD, '{es,lib,dist}', '**'),
      ]
      : []
  )
]
