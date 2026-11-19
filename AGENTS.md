# Repository guidance

## OpenAI documentation

Always use the OpenAI developer documentation MCP server when working with the OpenAI API, plugins, ChatGPT, Codex, or other OpenAI products, without waiting for an explicit request.

## Project

This repository contains the Hugo blog for `https://nherve.dev`. It uses Hugo Extended and the [DoIt theme](https://github.com/HEIGE-PCloud/DoIt), checked out as the Git submodule `themes/DoIt`. The FeelIt and LoveIt submodules are not the active theme.

## Dependency setup

Install mise and Git LFS before setting up the repository. Use mise to manage external development tools; `mise.toml` and `mise.lock` are the sources of truth for their versions. Hugo Extended is currently pinned to `0.160.1`. Add additional external development tools through mise rather than relying on untracked global installations. Keep the configuration and lockfile consistent when changing dependencies.

Run these commands from the repository root:

```sh
mise install
git submodule update --init --recursive themes/DoIt
git lfs install --local
git lfs pull
```

Git LFS manages image assets selected by `.gitattributes`. Retrieve the actual assets before previewing or building the site.

## Development and validation

Start the local preview with the existing mise task:

```sh
mise run serve
```

This runs `hugo serve --disableFastRender`. Validate site changes with the mise build tasks so they use the pinned Extended binary:

```sh
mise run build:production
mise run build:beta
```

Use both builds for shared configuration, template, or theme changes. Inspect affected pages in the local preview for content and visual changes. If dependencies, theme files, or LFS assets are unavailable, report the validation limitation explicitly.

Each build task clears generated output while preserving `public/.gitkeep`, runs Hugo, and copies the corresponding `_headers` and `_redirects` into `public/`. Beta uses Hugo's existing `staging` environment and includes drafts, expired posts, and future posts. Production includes expired posts but excludes drafts and future posts.

Install local Markdown hooks with `mise run install-hooks`. Hooks run mise-managed rumdl in check-only mode on staged Markdown files. Use `mise run lint-markdown -- path/to/file.md` to check specific files or `mise run check-hooks` to check all tracked Markdown, including historical files that may need cleanup. Non-draft PRs lint only added or modified Markdown and build both environments. Validate release checks with `mise run test:release`.

GitHub Actions deploys pushes to `master` as beta and valid `YYYY.MM.DD.N` tags on master history as production. See [deployment setup and releases](docs/deployment.md) for Cloudflare settings, required GitHub secrets, and release commands.

## Repository layout and editing conventions

- `content/`: posts, the about page, and page-local assets. Follow nearby posts for front matter, Markdown, and shortcodes; preserve existing asset references.
- `config/_default/`: shared Hugo and DoIt configuration. `config/production/` and `config/staging/` contain environment overrides and deployment files.
- `layouts/`: project template overrides, including partials. Prefer project overrides to editing theme submodule files.
- `data/`: structured site data, including author information.
- `static/`: assets copied directly into the generated site.
- `themes/DoIt/`: upstream theme submodule. Keep theme upgrades deliberate and separate from ordinary content changes.

Do not commit generated output such as `public/`, `resources/_gen/`, or Hugo lock files. Preserve the tracked `public/.gitkeep`. Keep content, configuration, and template changes focused on the requested task.

## Code Review Rules

These rules apply to Codex PR reviews. Read and follow each linked policy relevant to the changed files; these documents are authoritative repository review instructions.

- **English:** Follow [English proofreading](docs/agents/english-proofreading.md) for added or modified prose in Hugo Markdown blog posts. Report only clear errors at the policy's confidence threshold, preserving the author's voice.
- **Hugo Markdown:** Follow [Hugo Markdown compatibility](docs/agents/hugo-markdown-review.md). Report introduced build failures or incorrect rendering against the repository's pinned Hugo Extended, DoIt revision, and actual configuration; do not enforce generic Markdown style.
- **Attachment metadata:** Follow [Attachment metadata privacy](docs/agents/attachment-metadata-review.md) for added or modified attachments. Inspect actual embedded metadata for concrete private information useful for identification, location tracking, or social engineering. This review is metadata-only.

### Shared review behavior

- Review PR changes, using unchanged content for context. Do not report pre-existing issues unless the PR newly exposes them or causes them to break.
- Do not edit files, apply fixes, strip metadata, or change dependencies during review. Use existing tools; builds may write ignored artifacts. Report findings as PR review comments only, without posting unrelated messages.
- Make each finding concise and actionable: identify the affected location, explain the verified error or impact, and propose the smallest correction. Deduplicate findings and omit subjective suggestions, compliments, and generic feedback.
- Anchor text findings to affected changed lines. For binary attachments, identify the file and metadata field; use a file-level comment when available, never invent a text line or reproduce sensitive metadata values.
- If no reportable issues are found, return no findings. If a check cannot be completed, record the specific coverage limitation separately from findings in the review task's execution status, when supported. Do not treat missing evidence as a defect or claim an unperformed check passed.

### Hosted review limits

[OpenAI's Codex GitHub review documentation](https://developers.openai.com/codex/integrations/github) currently describes a P0/P1-only reporting threshold for hosted reviews. These policies define what to check, but cannot guarantee that lower-severity proofreading or compatibility findings will be posted. Keep severity proportional to actual impact; never promote a typo or other minor issue to bypass a reporting threshold. Review guidance does not replace tests or required approvals.
