# Attachment metadata privacy review

Review embedded metadata in attachments added or modified by the PR, including images and supported document, audio, and video formats. Include an existing attachment newly exposed by a changed reference or publishing configuration. Follow the shared review behavior in the root `AGENTS.md`.

This policy is **metadata-only**. Do not inspect visible screenshot or document content, perform OCR, identify people, or investigate the author's identity. Do not audit unrelated unchanged attachments.

## Inspection

1. Identify affected attachments from the PR diff and any newly exposed references. Inspect the actual binary contents, not just filenames, extensions, or text diffs.
2. Check whether Git LFS manages each file. A pointer is not the attachment. Use the resolved object for the PR revision if available; otherwise record a coverage limitation. Do not conclude that an LFS pointer has no sensitive image metadata.
3. Use available read-only tools to inspect metadata. With ExifTool installed, run the following for each affected file, substituting its path for `FILE`:

   ```sh
   exiftool -a -u -G1 FILE
   ```

   This displays duplicate tags, unknown tags, and metadata group names. Inspect supported EXIF, GPS, IPTC, XMP, PNG text, document properties, and other format-specific metadata. Use the installed tool's help for additional read-only options when necessary. Metadata within embedded previews or thumbnails is also in scope when the tool can inspect it; their presence alone is not a privacy finding, and their visible content is outside scope.
4. Distinguish stored metadata from tool-generated filesystem information such as the review checkout's directory, file permissions, or modification time. Those filesystem values do not establish an embedded leak.
5. Do not upload attachments to external metadata services, execute attachment contents, install dependencies, or run metadata-writing or stripping commands during review. If an inspection tool is unavailable, record the limitation; any later dependency addition must follow the repository's mise setup rules.

## Reportable exposures

Report only verified embedded values that disclose private information or concretely enable location tracking, identification, or targeted social engineering. Examples include:

- GPS coordinates, precise location names, or other location fields identifying a private place.
- Unique device, camera, or lens serial numbers and owner identifiers that enable personal correlation.
- Non-public author/contact fields, email addresses, usernames, organization details, or account identifiers.
- Local file paths, internal hostnames, private network details, or workflow metadata that expose private user or infrastructure information.
- Capture timestamps or metadata combinations when context establishes a concrete private location, schedule, or identity disclosure; a timestamp alone is not automatically a leak.

Do not flag metadata merely because it exists. Color profiles, dimensions, orientation, generic software versions or camera models, and intentionally public attribution or licensing are not findings without a concrete private disclosure. Compare the value's role with publication context, using only repository/PR evidence; do not conduct external identity searches. A field named `Author` is not inherently private, and a public byline does not make unrelated identifiers public.

## Findings and coverage

For a confirmed exposure, identify the attachment path and metadata group/tag, briefly explain the privacy impact, and recommend removing or replacing only the sensitive field or re-exporting a sanitized attachment. Never include the private value, GPS coordinates, complete local path, or a raw metadata dump in a PR comment. Use a file-level comment for binary files when available; do not invent line numbers. Deduplicate multiple fields that constitute the same exposure.

Missing tools, unsupported formats, unreadable files, incomplete embedded-metadata inspection, and unresolved LFS objects are coverage limitations, not confirmed exposures. Record the affected file and limitation separately from findings in the task's execution status when supported. Do not claim attachments are privacy-safe merely because one tool reports no tags; state only the coverage actually achieved. If inspection finds no concrete exposure, return no findings.

## References

- [ExifTool application documentation](https://exiftool.org/exiftool_pod.html) documents read-only extraction and options such as `-a`, `-u`, and `-G1`.
- [ExifTool supported formats and metadata](https://exiftool.org/) describe inspection capabilities and limitations; support depends on format and installed version.
- The repository's `.gitattributes` defines which assets use Git LFS; resolve those assets before drawing conclusions about their embedded metadata.
