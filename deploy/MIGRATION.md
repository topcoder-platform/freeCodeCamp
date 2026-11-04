# OIDC deployment migration

This change replaces the Auth0 credential broker and SSM-to-shell deployment path with [tc-deploy-scripts v2.0.5](https://github.com/topcoder-platform/tc-deploy-scripts/releases/tag/v2.0.5), fetched by tag and verified against commit `bff574ab5c0b46773e25d2af1eff76675fba2ba5`. Build and deployment run in separate jobs. The deployer cannot read Parameter Store, Secrets Manager or decrypt KMS data, including through another assumed role. ECS continues resolving the existing runtime secret references using the execution role.

## Production target

The read-only inventory on 2026-11-03 verified account `409275337247`, cluster `tc-freecodecamp-serverless`, service `freecodecamp-api`, family `freecodecamp-api`, and container `freecodecamp-api`. `prod.json` preserves the observed task/execution roles and names the proposed service-specific deployment role. [prod-baseline.json](https://github.com/topcoder-platform/v6-services-iac/blob/main/services/freeCodeCamp/deploy/prod-baseline.json) records references only; it contains no parameter values. Do not recreate the service or replace its complete task definition from this baseline.

## Installed infrastructure and production cutover

The dev deployment role/boundary, restricted empty CircleCI context, and immutable ECR tags are installed. Existing enhanced scanning is preserved. The production OIDC provider, deployment role/boundary and restricted context are also installed; production runtime and ECR changes remain gated on dev validation. Installation evidence and remaining service-specific steps are private in [PROVISIONING.txt](https://github.com/topcoder-platform/v6-services-iac/blob/main/services/freeCodeCamp/deploy/PROVISIONING.txt). Deploy roles have explicit secret-store and KMS-decryption denies. Runtime values are retrieved only by ECS using the execution role.

At production cutover, stop legacy publishers, enable unconditional tag immutability, adopt missing task health checks with the reviewed image, and use the approval-gated `prod` workflow. Preserve capacity, roles, secret references and rollback. Do not run production before dev validation.

## Development acceptance

This PR targets `dev`. Administrator-installed dev prerequisites are recorded in the private IaC repository. Existing dev runtime values were migrated from the Jenkins configuration to execution-role-only encrypted runtime references; the existing image is retained for prerequisite validation.

- The attempted runtime-reference rollout failed ALB health and was rolled back; compare the baked image configuration and resolve startup/health behavior before retrying.
- Merge security prerequisite #112 before deployment PR #113.
- Resolve the separate frontend release before retiring the combined Jenkins deployment.

Run the shared offline suite, validate the CircleCI config and IAM policies, and test a dev release plus an unhealthy-image rollback. Verify CloudTrail contains no SSM/Secrets Manager calls from the deployment principal. Remove its old broker grants only after migration. Check the runtime secret references and roles stayed unchanged. Production requires the manual approval job and a passing digest/scan/health verification.

The pinned executor is `cimg/aws@sha256:4cf3768db00ddf9bc439b8c84e8a60c11a14edf81c8baf76f74132144f8340d5`. Python/AWS CLI/Buildx/Git compatibility was tested with the shared offline suite. No package installation or service build runs in the deployment job. The Dockerfile retains the existing in-image quality gates. This PR does not deploy, change IAM, rotate credentials, or claim a successful live rollout.

## Jenkins migration, prerequisite and runtime configuration

This PR is stacked on [security PR #112](https://github.com/topcoder-platform/freeCodeCamp/pull/112), which supplies the patched API dependencies and non-root runtime. This PR now targets dev and retains that prerequisite in its ancestry; merge #112 first, then this PR, and promote both to the existing `prod` branch. There is no master branch. OIDC trust and both checkout/configuration refs bind exactly to `prod` for production.

Disable the Jenkins release job and remove its global Auth0/AWS bindings. The old Jenkinsfile fetched a secret `.env` artifact from S3, baked it into the API image and also deployed the frontend. The replacement CircleCI workflow releases the ECS API only. **Before merging, establish a separate frontend artifact release with its own identity and narrow S3/CloudFront permissions.** This change does not grant S3 or CloudFront access to the ECS deployer and does not claim the frontend release is migrated.

The API now compiles source/curriculum in a credential-free Docker stage, runs API security tests, and installs production API dependencies separately. No `.env` is copied. Startup generates only the public config JSON from runtime environment variables and lets PM2 inherit the existing process environment. Build fixture public URLs are removed from the runtime image.

The observed production task has no secret references: its old image supplies them. An administrator must migrate all required application values from the old configuration into explicitly scoped ECS runtime secret references before rollout, including MongoDB, session/cookie/JWT secrets, Auth0, enabled social/payment integrations and SES credentials where still used. Set the actual public locations, cookie domain, locales and deployment environment too. Choose and review their parameter/secret ARNs in IaC; none have been guessed or fetched here. The execution role alone reads them. Keep the absent task role unless a separately reviewed runtime AWS integration requires one. Verify DB, login, mail, curriculum, API health and rollback in dev before enabling production.

The removed `.npmrc` held only public installation settings. Docker supplies them through environment variables; manual installs need `CYPRESS_INSTALL_BINARY=0 npm ci --ignore-scripts --legacy-peer-deps --install-links` followed by the reviewed compatibility patch command.

Validation: the complete new API image builds; all ten API/compatibility security tests pass inside its build stage. A non-root runtime smoke check verifies `.env` and the build fixture config are absent and generated public JSON excludes private markers. CircleCI and AWS IAM/CloudFormation validation pass. Runtime integration with actual dev settings remains required.

## Infrastructure source

IAM templates and detailed AWS baselines are maintained in the private [v6-services-iac service directory](https://github.com/topcoder-platform/v6-services-iac/tree/main/services/freeCodeCamp). Provision infrastructure separately with an administrator identity; application CI does not fetch that repository or install IAM. Required application manifests and health-check proposals remain here.

## Dev branch refresh

This PR targets `dev` and preserves its current application/dependency fixes. The shared suite is v2.0.5 (82 offline tests); service-specific adapters and their tests remain part of review. Use the current readiness record above for the remaining merge/deployment gates. Updating these files does not provision AWS or CircleCI resources.

Source checkout uses the public HTTPS repository and verifies the exact CircleCI commit, avoiding dependency on failing SSH checkout keys. No GitHub token is added to build or deployment contexts.

The security prerequisite’s `legacy-peer-deps=true` and `install-links=true` settings are explicit in npm CI commands. This preserves its existing lockfile/dependency behavior without restoring a committed `.npmrc`; the Docker build already supplies the same settings.
