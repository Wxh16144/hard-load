import fs from "fs";
import { fileURLToPath } from 'url';
import path from "path";
import c from "kleur";
import mri from "mri";
import terminalLink from 'terminal-link';
import { detectSync, resolveCommand } from 'package-manager-detector'
import { execaSync } from 'execa'
import { deleteSync } from 'del';
import list from "./list";
import { Argv } from "./type";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resolvePath = (...arg: any[]) => path.resolve(__dirname, '..', ...arg);
const readFileSync = (path: string) => fs.readFileSync(resolvePath(path), 'utf8');
const pkg = JSON.parse(readFileSync('./package.json'));
const command = Object.keys(pkg.bin ?? {})[0] ?? pkg.name;

const argv = mri<Argv>(process.argv.slice(2), {
  alias: { h: 'help', v: 'version', l: 'list' },
});

async function main(args: Argv = argv) {
  const dryRun = !!(
    args.dryRun /** --dry-run */
    ?? process.env.DRY_RUN
    ?? process.env.DEBUG === pkg.name
  )

  if (args.version) {
    console.log(`${c.bold(pkg.name)}: ${c.green('v' + pkg.version)}`);
    return;
  }

  if (args.list) {
    console.log(list.join('\n'));
    return;
  }

  if (args.help) {
    console.log(`
    npx ${c.bold(command)} [npm script name]/[options]
    ----------------------------------------
    -${c.bold('h')}, --help: show help.
    -${c.bold('l')}, --list: show files to be deleted.
    -${c.bold('v')}, --version: show version. ${c.green('v' + pkg.version)}
    See more: ${c.gray(terminalLink(pkg.homepage, pkg.homepage))}
    ----------------------------------------
    ${c.bold('e.g.')} ${c.green(`${command} -h`)} 
  `)
    return;
  }

  const consuming = (function () {
    const start = process.hrtime.bigint();
    deleteSync(
      list,
      // https://github.com/sindresorhus/del?tab=readme-ov-file#options
      {
        force: true,
        dot: true,
        dryRun,
      }
    )
    const end = process.hrtime.bigint();

    return Number(end - start) / 1e6;
  }());

  if (!dryRun) {
    console.log(`${c.green(
      c.bold(
        terminalLink(`[${String(pkg.name).toUpperCase()}]`, pkg.homepage)
      )
    )}: Hard disk cleaned! 🎉 ${c.gray(`(${consuming}ms)`)}`
    );
  }

  // hasScript 
  if (args._.length > 0) {
    const pm = detectSync();
    if (pm === null) return;

    const { command, args: realArgs } = resolveCommand(pm.agent, 'run', args._)!;
    execaSync(command, realArgs, {
      // https://github.com/sindresorhus/execa/blob/main/docs/api.md#options-1
      stdio: 'inherit',
      cwd: process.cwd(),
    });
  }
}

export default main;
