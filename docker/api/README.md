# API container maintenance

Use Node.js 22.13+ and npm 10+ for development. CI uses Node.js 22, and production images use Alpine's dynamically linked Node.js 26 package. The repository's legacy frontend peer dependency constraints require the checked-in `legacy-peer-deps` setting.

`ECSDockerfile` retains the Jenkins contract: compile the application and generate `config` first, then build the image. The image installs only the API workspace's production dependencies from the root lockfile. It runs the locally installed PM2 as UID 10001, with its writable state in `/tmp/pm2`. Set `WEB_CONCURRENCY` to limit workers; the default remains `max`.

ECS currently provides its configuration through the build's `.env` artifact; this Dockerfile retains that input. The standalone Dockerfile retains its Doppler build flow. No deployment or database configuration changes are required by this update.

The API uses the maintained Cypress Request fork, Nodemailer 10 and AWS SDK v3 SES, with the existing LoopBack Email model API. SES accepts `SES_ID`, `SES_SECRET`, optional `SES_SESSION_TOKEN`, and `SES_REGION` (falling back to `AWS_REGION` and then `us-east-1`). Without explicit credentials, AWS SDK v3 uses its default provider chain. Development SMTP remains available. The unused direct-MX transport fails closed.

`tools/legacy-compat/apply.cjs` adapts legacy UUID imports in Passport, Jayson, Gatsby and HTTP Auth, plus private Cheerio imports in Enzyme to the patched packages. It runs after a normal root install, before API compilation, and explicitly during production dependency installation. If installing with `--ignore-scripts`, run it before starting the API. Patches check their expected source and are idempotent. The minimatch adapter retains legacy callable/glob behavior while delegating matching to minimatch 11.

After generating the usual configuration, run:

```sh
npm run test:api-security
npm audit --workspace api-server --include-workspace-root=false
npm run test-server -- --runInBand
```

The focused security tests exercise SES MIME/error handling, SMTP delivery, HTTP redirects/forms, the Swagger explorer, UUID compatibility, bounded glob matching, and Passport session regeneration before login cookies/redirects. The existing API suite has eight failures around the upstream cookie contract; the same failures reproduce on unchanged `dev` source with the same dependencies (136 tests pass). The current Topcoder cookie contract uses `tcjwt` and top-level JWT expiry claims.
