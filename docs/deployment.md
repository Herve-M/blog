# Builds and deployments

GitHub Actions builds this Hugo site and uploads the generated `public/` directory to the existing Cloudflare Pages project `blog-hervem`. Cloudflare continues to host the site.

| Git event | Hugo environment | Pages branch | Public domain |
| --- | --- | --- | --- |
| Push to `master` | `staging` | `master` (preview) | `beta.nherve.dev` |
| Push a valid `YYYY.MM.DD.N` tag on master history | `production` | `production` | `nherve.dev` |
| Non-draft pull request | Both, checks only | No upload | None |

## One-time migration

Before enabling the GitHub deployment workflow:

1. In the existing `blog-hervem` Pages project, set the production branch to `production`. This is a Pages deployment label; releases are built from their tagged commit, and no Git production branch needs updating.
2. Disable automatic production branch deployments and set automatic preview branch deployments to **None**. This prevents Cloudflare from building alongside GitHub. An existing Git-integrated project can receive Wrangler uploads after its automatic builds are disabled; do not delete or recreate the project. See [Cloudflare Git integration](https://developers.cloudflare.com/pages/configuration/git-integration/#disable-automatic-deployments).
3. Keep `nherve.dev` attached to this project. Keep `beta.nherve.dev` attached as a custom domain and update its proxied CNAME target to `master.blog-hervem.pages.dev`, replacing the old preview branch alias. See [custom domains on preview branches](https://developers.cloudflare.com/pages/how-to/custom-branch-aliases/).
4. Add the repository Actions secrets below. Create the API token in Cloudflare; enter its value directly into GitHub secrets, never into source files.

| GitHub Actions secret | Value |
| --- | --- |
| `CLOUDFLARE_ACCOUNT_ID` | The account containing `blog-hervem` |
| `CLOUDFLARE_API_TOKEN` | API token with **Account / Cloudflare Pages / Edit**, restricted to that account |

These are repository secrets, available to the upload step in the deployment workflow. PR checks use `pull_request` events and do not receive Cloudflare credentials. The workflow's GitHub token has only `contents: read`; it does not post PR comments.

Cloudflare account settings, DNS records, and GitHub secrets are configured separately from this repository change. Use the Cloudflare dashboard to confirm the existing project and domain mappings before cutover.

## Local setup and checks

Install mise and Git LFS, then run:

```sh
mise install
git submodule update --init --recursive themes/DoIt
git lfs install --local
git lfs pull
mise run install-hooks
```

Mise pins Hugo Extended, Node LTS, Wrangler, GitHub CLI, prek, and rumdl. Keep `mise.toml` and `mise.lock` together when updating tools. The inactive FeelIt and LoveIt theme submodules are not needed.

```sh
mise run serve
mise run build:beta
mise run build:production
mise run test:release
mise run lint-markdown -- docs/deployment.md
```

Each build first clears `public/`, preserving its tracked `.gitkeep`, then runs Hugo and copies the environment's `_headers` and `_redirects`. Run builds sequentially in a shared checkout. Beta includes drafts, expired posts, and future posts; production includes expired posts but excludes drafts and future posts.

Prek runs rumdl without fixing files. Hooks check staged Markdown locally. PRs check Markdown added or modified since the merge base with the target branch, and build both environments against the PR merge revision with LFS assets and DoIt initialized. Opening, updating, reopening, or marking a PR ready for review triggers checks; draft PRs skip them. Fork PRs can run these checks without deployment secrets.

`mise run check-hooks` checks all tracked Markdown, including unchanged historical posts. Those historical files are outside the initial lint migration and may report existing issues. The lint configuration permits long lines, inline HTML, and titles supplied through Hugo front matter; content files use rumdl's Hugo flavor. Themes and generated files are excluded.

## Production releases

Create a tag of the form `YYYY.MM.DD.N`, such as `2026.11.19.1`. Use a real calendar date, two-digit month and day, and a positive counter without leading zeros. There is no `v` prefix. Increment the counter for additional releases on the same date.

```sh
git switch master
git pull --ff-only
git tag -a 2026.11.19.1 -m "Release 2026.11.19.1"
git push origin refs/tags/2026.11.19.1
```

Tags may reference any commit reachable from `master`, including an older commit for a deliberate rollback. Both lightweight and annotated tags work. Tags outside master history, malformed date-prefixed tags, and nonexistent dates fail validation before upload. Unrelated tags and pushes to other branches do not deploy. Do not move published release tags; create a new tag instead. Tags do not automatically create GitHub Releases.

GitHub reads a push-triggered workflow from the tagged commit. A commit predating this migration has no workflow to trigger, and a historical commit may contain an older workflow. To deploy either through the current release workflow, push the tag, then dispatch the workflow from `master`:

```sh
mise exec -- gh workflow run deploy.yml --ref master -f release_tag=2026.11.19.1
```

The manual path checks out the tagged revision and validates its master ancestry, tag, and commit SHA. It uses the current `master` versions of `mise.toml`, `mise.lock`, and the validator, while building the historical content, theme revision, Hugo configuration, headers, and redirects. The run must still pass the production build. See [GitHub workflow trigger behavior](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#push).

GitHub uploads beta with `--branch master` and production with `--branch production`, recording the checked-out commit SHA. The deployment run summary links to the uploaded version. New beta pushes cancel superseded beta runs; production uploads share a concurrency group without canceling a running release. GitHub concurrency keeps at most one pending run, so push release tags individually and wait for each deployment to finish.

After cutover, verify the first master deployment at `beta.nherve.dev`, then a tagged release at `nherve.dev`. Confirm the expected site title, post visibility, headers, redirects, and deployed commit in the Actions run and Cloudflare dashboard. If a release needs rolling back, tag the desired older master commit with a new CalVer tag and push it.
