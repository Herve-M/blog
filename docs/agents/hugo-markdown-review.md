# Hugo Markdown compatibility review

Review added or modified Hugo content for concrete build failures or incorrect rendered output. Also consider existing content affected by configuration, layout, or theme changes in the PR. Follow the shared review behavior in the root `AGENTS.md`.

## Compatibility target

- Use the Hugo Extended version declared in `mise.toml` and `mise.lock`, not a globally installed binary or an assumed latest release.
- Use the DoIt submodule revision recorded by the PR and project template overrides. Check shortcode implementations and parameters against that revision; current upstream documentation may describe newer behavior.
- Read shared configuration in `config/_default/` and the relevant production or staging overrides. The repository currently enables raw HTML through `markup.goldmark.renderer.unsafe` and enables definition lists, footnotes, linkify, strikethrough, tables, task lists, and typographer. Recheck these settings when reviewing a change.

## Checks

- Verify changed front matter parses and that changed fields used by Hugo or DoIt retain compatible types and values. Report a demonstrated generation or presentation defect, not a preference for another front matter format or additional optional fields.
- Check shortcode names, parameters, delimiters, closing tags, and nesting against the pinned Hugo and theme implementations. Distinguish executable shortcodes from intentionally escaped examples; do not rewrite working `{{< ... >}}` and `{{% ... %}}` forms interchangeably.
- Verify changed internal links, `ref`/`relref` targets, image paths, and page resources resolve in the site's page-bundle and static-asset structure, respecting filename case. Check changed featured-image fields where used by DoIt. Do not assume every relative path is a repository-root path.
- Check fences, lists, tables, inline markup, HTML, and shortcode interactions only when they cause incorrect rendering or generation failures. A successful build alone does not prove that the affected content renders as intended.
- Accept constructs supported by the configured renderer and theme, including enabled raw HTML and extensions. Do not report heading preferences, line wrapping, bullet style, or other lint-only differences without a concrete compatibility problem. Technical examples are not subject to the English proofreading policy, but their surrounding Markdown must still render correctly.

## Evidence and reporting

Use source inspection and, when dependencies are available, the mise-wrapped production and staging builds documented in `AGENTS.md`. Use both builds for shared configuration, layout, or theme changes. Inspect affected generated HTML or the local preview when the concern is rendering rather than build syntax. Do not change tracked files or install tools as part of review.

Tie each finding to a PR change, identify the affected line and failing page or behavior, and propose the smallest compatible correction. Use unchanged content only as context or to demonstrate a regression caused by the PR. Do not report unrelated build failures as introduced defects.

If the pinned Hugo, DoIt checkout, LFS assets, or another required dependency is unavailable, record the affected check as a coverage limitation separately from findings. Do not infer that a shortcode is missing merely because the theme submodule is uninitialized. Do not turn an unavailable remote URL into a broken-link finding without evidence of an actual defect.

## References

- [Hugo markup configuration](https://gohugo.io/configuration/markup/) explains Goldmark and its configuration; repository settings and the pinned version determine compatibility.
- [Hugo shortcode documentation](https://gohugo.io/content-management/shortcodes/) describes shortcode syntax and behavior.
- [DoIt upstream documentation and source](https://github.com/HEIGE-PCloud/DoIt) provide theme-specific guidance; verify it against the checked-out revision and project overrides.
