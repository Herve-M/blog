import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, test } from 'node:test';
import { validateRelease } from './validate-release.mjs';

const directory = mkdtempSync(join(tmpdir(), 'blog-release-'));
const git = (...args) => execFileSync('git', args, {
  cwd: directory,
  encoding: 'utf8',
  // Keep global signing, hooks, and editor preferences out of the fixture.
  env: {
    ...process.env,
    GIT_CONFIG_GLOBAL: process.platform === 'win32' ? 'NUL' : '/dev/null',
    GIT_CONFIG_NOSYSTEM: '1',
  },
}).trim();
git('init', '--quiet', '--initial-branch=master');
git('config', 'user.name', 'Release test');
git('config', 'user.email', 'release@example.invalid');
git('commit', '--quiet', '--allow-empty', '-m', 'First master commit');
const first = git('rev-parse', 'HEAD');
git('tag', '2026.11.19.1');
git('tag', '-a', '2026.11.19.2', '-m', 'Annotated release');
git('tag', '2024.02.29.1');
git('commit', '--quiet', '--allow-empty', '-m', 'Later master commit');
git('update-ref', 'refs/remotes/origin/master', 'HEAD');
git('checkout', '--quiet', '--detach', first);
git('commit', '--quiet', '--allow-empty', '-m', 'Outside master history');
git('tag', '2026.11.19.3');
git('checkout', '--quiet', '--detach', first);
after(() => rmSync(directory, { recursive: true, force: true }));

for (const tag of ['2026.11.19.1', '2026.11.19.2', '2024.02.29.1']) {
  test(`accepts ${tag} on an older master commit`, () => {
    assert.equal(validateRelease(tag, directory), first);
  });
}

for (const tag of [
  '2026.02.29.1', '2026.04.31.1', '2026.13.01.1', '2026.00.01.1',
  '2026.11.00.1', '2026.11.19.0', '2026.11.19.01', '2026.1.19.1',
  '2026.11.19', 'v2026.11.19.1', '2026.11.19.1-extra',
]) {
  test(`rejects invalid CalVer ${tag}`, () => {
    assert.throws(() => validateRelease(tag, directory), /Invalid CalVer/);
  });
}

test('rejects a release outside master history', () => {
  assert.throws(() => validateRelease('2026.11.19.3', directory), /not reachable from master/);
});

test('rejects building a different commit from the tag', () => {
  git('checkout', '--quiet', '--detach', 'refs/remotes/origin/master');
  try {
    assert.throws(() => validateRelease('2026.11.19.1', directory), /checked-out commit/);
  } finally {
    git('checkout', '--quiet', '--detach', first);
  }
});
