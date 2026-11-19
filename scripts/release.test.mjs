import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { nextReleaseTag, release } from './release.mjs';

const now = new Date('2026-11-19T23:59:00Z');

function fixture(t) {
  const directory = mkdtempSync(join(tmpdir(), 'blog-publish-'));
  const remote = join(directory, 'remote.git');
  const local = join(directory, 'local');
  mkdirSync(local);
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const git = (...args) => execFileSync('git', args, { cwd: local, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  git('init', '--quiet', '--bare', '--initial-branch=master', remote);
  git('init', '--quiet', '--initial-branch=master');
  git('config', 'user.name', 'Release test');
  git('config', 'user.email', 'release@example.invalid');
  git('commit', '--quiet', '--allow-empty', '-m', 'Initial commit');
  git('remote', 'add', 'origin', remote);
  git('push', '--quiet', 'origin', 'master');
  const initial = git('rev-parse', 'HEAD');
  return { local, remote, git, initial };
}

// Isolate local and bare-remote hooks, signing, and identities from user preferences.
process.env.GIT_CONFIG_GLOBAL = process.platform === 'win32' ? 'NUL' : '/dev/null';
process.env.GIT_CONFIG_NOSYSTEM = '1';

test('chooses the next numeric UTC daily counter, ignoring unrelated and malformed tags', () => {
  assert.equal(nextReleaseTag(['2026.11.19.2', '2026.11.19.10', '2026.11.19.01', '2026.11.19.99-beta', '2026.11.18.99'], now), '2026.11.19.11');
  assert.equal(nextReleaseTag([], new Date('2026-11-20T00:01:00+07:00')), '2026.11.19.1');
});

test('creates an empty release commit and annotated tag and pushes both', t => {
  const { local, remote, git, initial } = fixture(t);
  const tag = release(local, now);
  assert.equal(tag, '2026.11.19.1');
  const head = git('rev-parse', 'HEAD');
  assert.notEqual(head, initial);
  assert.equal(git('log', '-1', '--format=%s'), `Release ${tag}`);
  assert.equal(git('cat-file', '-t', `refs/tags/${tag}`), 'tag');
  assert.equal(git('--git-dir', remote, 'rev-parse', `refs/tags/${tag}^{commit}`), head);
  assert.equal(git('--git-dir', remote, 'rev-parse', 'refs/heads/master'), head);
});

test('commits staged changes and leaves untracked files alone', t => {
  const { local, git } = fixture(t);
  writeFileSync(join(local, 'post with spaces.md'), '# New post\n');
  git('add', 'post with spaces.md');
  writeFileSync(join(local, 'untracked.md'), '# Untracked post\n');
  release(local, now);
  assert.equal(git('show', 'HEAD:post with spaces.md'), '# New post');
  assert.equal(git('ls-tree', '--name-only', 'HEAD', 'untracked.md'), '');
  assert.equal(git('status', '--porcelain'), '?? untracked.md');
});

test('fetches remote-only tags before allocating the release counter', t => {
  const { local, remote, git } = fixture(t);
  git('--git-dir', remote, 'tag', '2026.11.19.10');
  assert.equal(release(local, now), '2026.11.19.11');
});

test('does not publish unrelated annotated tags even when followTags is enabled', t => {
  const { local, remote, git } = fixture(t);
  git('config', 'push.followTags', 'true');
  git('tag', '-a', 'unrelated-release', '-m', 'Keep this local');
  release(local, now);
  assert.equal(git('--git-dir', remote, 'tag', '--list'), '2026.11.19.1');
});

test('refuses feature branches without creating a commit or tag', t => {
  const { local, git, initial } = fixture(t);
  git('switch', '--quiet', '-c', 'feature/test');
  assert.throws(() => release(local, now), /on master/);
  assert.equal(git('rev-parse', 'HEAD'), initial);
  assert.equal(git('tag', '--list'), '');
});

test('refuses unstaged tracked edits without creating a release', t => {
  const { local, git } = fixture(t);
  writeFileSync(join(local, 'post.md'), '# Original\n');
  git('add', 'post.md');
  git('commit', '--quiet', '-m', 'Add post');
  const before = git('rev-parse', 'HEAD');
  writeFileSync(join(local, 'post.md'), '# Unstaged\n');
  assert.throws(() => release(local, now), /Unstaged tracked changes/);
  assert.equal(git('rev-parse', 'HEAD'), before);
  assert.equal(git('tag', '--list'), '');
});

test('refuses a master branch behind the remote', t => {
  const { local, git, initial } = fixture(t);
  git('commit', '--quiet', '--allow-empty', '-m', 'Remote change');
  git('push', '--quiet', 'origin', 'master');
  git('reset', '--quiet', '--hard', initial);
  assert.throws(() => release(local, now), /behind or diverged/);
  assert.equal(git('rev-parse', 'HEAD'), initial);
  assert.equal(git('tag', '--list'), '');
});

test('refuses a master branch diverged from the remote', t => {
  const { local, git, initial } = fixture(t);
  git('commit', '--quiet', '--allow-empty', '-m', 'Remote change');
  git('push', '--quiet', 'origin', 'master');
  git('reset', '--quiet', '--hard', initial);
  git('commit', '--quiet', '--allow-empty', '-m', 'Conflicting local history');
  const before = git('rev-parse', 'HEAD');
  assert.throws(() => release(local, now), /behind or diverged/);
  assert.equal(git('rev-parse', 'HEAD'), before);
  assert.equal(git('tag', '--list'), '');
});

test('atomic rejection leaves remote master unchanged and retains the local release for retry', t => {
  const { local, remote, git, initial } = fixture(t);
  // Reject only the tag: without --atomic the branch update would succeed.
  writeFileSync(join(remote, 'hooks/update'), '#!/bin/sh\ncase "$1" in refs/tags/*) exit 1 ;; esac\nexit 0\n', { mode: 0o755 });
  assert.throws(() => release(local, now), /Push failed; local release commit and tag 2026\.11\.19\.1 were kept/);
  assert.equal(git('--git-dir', remote, 'rev-parse', 'refs/heads/master'), initial);
  assert.equal(git('--git-dir', remote, 'tag', '--list'), '');
  assert.notEqual(git('rev-parse', 'HEAD'), initial);
  assert.equal(git('rev-parse', 'refs/tags/2026.11.19.1^{commit}'), git('rev-parse', 'HEAD'));
});
