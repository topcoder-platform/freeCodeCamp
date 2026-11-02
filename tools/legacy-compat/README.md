# Maintaining the dependency compatibility layer

The main learning client retains React 16 and its existing curriculum renderer.
Gatsby 4.25.9, Storybook 8.6.19 and current Webpack/PostCSS dependencies replace
the vulnerable build tooling. The separate challenge editor uses React 18,
React Router 7 and Vite 8; its commands, port 3300, `build` output directory and
`REACT_APP_CHALLENGE_EDITOR_API_LOCATION` configuration remain available.

Gatsby's Parcel core, cache and plugins must use the same 2.16.4 release. Gatsby
and Parcel also share LMDB 2.8.5: loading different native LMDB versions in one
process caused a crash while opening the compilation cache. Remove the local
Gatsby `.cache` directory when changing this dependency family.

The root postinstall script applies narrow, idempotent compatibility patches.
Each patch checks the expected source and fails if an upstream change no longer
matches. Besides the API's UUID and Enzyme adaptations, it updates legacy Got
JSON flags and uses public Webpack exports in Gatsby's partial hydration plugin.

The local adapters retain interfaces used by older callers:

- `file-type-compat` maps Gatsby's async file detection methods to file-type 22.
- `proxy-agent-compat` maps the S3 deploy plugin's callable proxy constructor to
  proxy-agent 8 and preserves the explicitly selected proxy URL.
- `decode-uri-component-compat` exposes the patched decoder's default export to
  CommonJS callers. Node.js 22.13 or later is required.
- `minimatch-compat` preserves the callable matcher and delegates to minimatch 11.

Run `npm ci`, `npm run test:frontend-compat`, `npm run test:api-security`,
`npm audit`, the Gatsby build, Storybook build and challenge editor build after
refreshing these dependencies. Jest 27 needs an explicit Gatsby wildcard export
mapping and Babel transforms for the ESM query-string dependencies.

When changing overrides, verify the **resolved lockfile versions**, not just the
manifest. Incremental npm lockfile updates can retain old nested versions. If
that happens, generate the lockfile in an empty staging directory containing the
root/workspace manifests and local adapters, then verify a clean `npm ci`.

The editor has its own TypeScript project and React 18 declarations. The root
project checks its API while the editor is checked separately by `lint:ts`.
Generated Storybook/editor bundles are excluded from source linting and type
projects, since their minified global names can collide with Jest declarations.

Known fork baseline: `/learn/` asks for the challenge with superOrder, order and
challengeOrder all zero. The QA curriculum occupies superOrder zero but starts
at order 19, so that unchanged query has no result. Classic and video challenge
URLs render and hydrate successfully; the curriculum landing-page mismatch and
existing cookie/curriculum/layout/snapshot test failures remain separate work.
