import { execFileSync, spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function nextReleaseTag(tags, now = new Date()) {
  const date = now.toISOString().slice(0, 10).replaceAll('-', '.');
  let next = 1n;
  for (const tag of tags) {
    if (!tag.startsWith(`${date}.`)) continue;
    const counter = tag.slice(date.length + 1);
    if (/^[1-9]\d*$/.test(counter) && BigInt(counter) >= next) {
      next = BigInt(counter) + 1n;
    }
  }
  return `${date}.${next}`;
}

export function release(cwd = process.cwd(), now = new Date()) {
  const git = (...args) => execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
  if (git('branch', '--show-current') !== 'master') {
    throw new Error('Run the release task on master after merging the changes to release.');
  }
  if (git('diff', '--name-only').length > 0) {
    throw new Error('Unstaged tracked changes exist. Stage or stash them before releasing.');
  }

  git('fetch', '--tags', 'origin', 'refs/heads/master:refs/remotes/origin/master');
  const ancestry = spawnSync('git', ['merge-base', '--is-ancestor', 'refs/remotes/origin/master', 'HEAD'], { cwd });
  if (ancestry.error || ancestry.status !== 0) {
    throw new Error('Local master is behind or diverged from origin/master. Update it before releasing.');
  }

  const tag = nextReleaseTag(git('tag', '--list').split('\n'), now);
  const message = `Release ${tag}`;
  git('commit', '--allow-empty', '-m', message);
  try {
    git('tag', '-a', tag, '-m', message);
  } catch (error) {
    throw new Error(`Release commit was created, but tag ${tag} could not be created. Resolve the Git error before retrying.`, { cause: error });
  }
  try {
    // Explicit refs avoid publishing other branches or annotated tags.
    git('-c', 'push.followTags=false', 'push', '--atomic', 'origin', 'HEAD:refs/heads/master', `refs/tags/${tag}:refs/tags/${tag}`);
  } catch (error) {
    throw new Error(`Push failed; local release commit and tag ${tag} were kept. After resolving the Git error, retry with: git -c push.followTags=false push --atomic origin HEAD:refs/heads/master refs/tags/${tag}:refs/tags/${tag}`, { cause: error });
  }
  return tag;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.length !== 2) throw new Error('Usage: mise run release (no arguments)');
    console.log(`Published ${release()}`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
