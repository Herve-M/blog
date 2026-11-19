import { execFileSync, spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function validateRelease(tag, cwd = process.cwd()) {
  const match = /^([1-9]\d{3})\.(\d{2})\.(\d{2})\.([1-9]\d*)$/.exec(tag ?? '');
  if (!match) {
    throw new Error('Invalid CalVer: expected YYYY.MM.DD.N with a positive counter and no leading zeros');
  }
  const date = `${match[1]}-${match[2]}-${match[3]}`;
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
    throw new Error('Invalid CalVer: date does not exist');
  }

  const git = (...args) => execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
  const commit = git('rev-parse', '--verify', '--end-of-options', `refs/tags/${tag}^{commit}`);
  const ancestry = spawnSync('git', ['merge-base', '--is-ancestor', commit, 'refs/remotes/origin/master'], { cwd });
  if (ancestry.error || ancestry.status !== 0) {
    throw new Error('Release commit is not reachable from master (full master history is required)');
  }
  if (git('rev-parse', 'HEAD') !== commit) {
    throw new Error('The checked-out commit does not match the release tag');
  }
  return commit;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    console.log(validateRelease(process.argv[2]));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
