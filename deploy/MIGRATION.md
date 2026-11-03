# OIDC deployment migration

This change replaces the Auth0 credential broker and SSM-to-shell deployment path with the reviewed [shared suite PR #40](https://github.com/topcoder-platform/tc-deploy-scripts/pull/40), pinned to `bbc9b3d0c702947d26b6d9686d7b29104ebe461a`. Build and deployment run in separate jobs. The deployer cannot read Parameter Store, Secrets Manager or decrypt KMS data, including through another assumed role. ECS continues resolving the existing runtime secret references using the execution role.

## Production target

The read-only inventory on 2026-11-03 verified account `409275337247`, cluster `tc-freecodecamp-serverless`, service `freecodecamp-api`, family `freecodecamp-api`, and container `freecodecamp-api`. `prod.json` preserves the observed task/execution roles and names the proposed service-specific deployment role. `prod-baseline.json` records references only; it contains no parameter values. Do not recreate the service or replace its complete task definition from this baseline.

## Infrastructure prerequisites, applied separately by an administrator

1. In each account, register the CircleCI OIDC issuer `https://oidc.circleci.com/org/947bef5e-1669-415d-b83c-4fc85155b7df` with client ID `947bef5e-1669-415d-b83c-4fc85155b7df`. The current production account has only the legacy Auth0 provider. Do not remove that provider until all its consumers have migrated.
2. Review and install `iam/prod-role.cloudformation.json` with an administrator/IaC identity. It creates the proposed deployment role and applies the same least-privilege policy as a permissions boundary. The trust binds this CircleCI project, repository, checkout branch and configuration branch. It does not grant infrastructure creation to CircleCI.
3. Configure ECR repository `freecodecamp-api` with unconditional `IMMUTABLE` tags and supported scan-on-push. Existing tags are not retagged. The release fails for MEDIUM/HIGH/CRITICAL/UNDEFINED findings, failed scans, or a mismatched digest.
4. In the infrastructure that owns the task definition, add the reviewed container check from `prod-healthcheck.json`, keeping all roles, runtime secret references, resources, mounts and sidecars. Verify the health endpoint against the running container in dev first. Preserve circuit-breaker rollback and positive desired capacity. Remove any `RESET_DB` secret binding and plaintext secret environment entries before adoption. Keep the execution role's runtime read permissions scoped to the references that service needs.
5. Create restricted `freeCodeCamp-dev-deploy` and `freeCodeCamp-prod-deploy` CircleCI contexts without Auth0/static AWS credentials. Restrict production to the reviewed `prod` checkout and configuration ref, authorized operators, and approval job. Remove legacy credentials from project settings too: removing `org-global` alone does not remove project-level variables. Confirm `CIRCLE_OIDC_TOKEN_V3` is issued. Disable secret access for forks and SSH debugging in deployment jobs.

## Development acceptance before merge/release

The saved dev AWS session had expired during preparation. No dev cluster, role or family has been guessed. **This PR is a draft until an administrator verifies and commits `deploy/dev.json` for account `811668436784` and branch `dev`, with corresponding narrow IAM policy/trust.** Use the same schema as `prod.json`, but inspect the actual dev resources and roles; do not replace just the account number. The dev job fails closed while its manifest is absent. Branches other than `dev` and `prod` build only and receive no deployment context.

Run the shared offline suite, validate the CircleCI config and IAM policies, and test a dev release plus an unhealthy-image rollback. Verify CloudTrail contains no SSM/Secrets Manager calls from the deployment principal. Remove its old broker grants only after migration. Check the runtime secret references and roles stayed unchanged. Production requires the manual approval job and a passing digest/scan/health verification.

The pinned executor is `cimg/aws@sha256:4cf3768db00ddf9bc439b8c84e8a60c11a14edf81c8baf76f74132144f8340d5`. Python/AWS CLI/Buildx/Git compatibility was tested with the shared offline suite. No package installation or service build runs in the deployment job. The Dockerfile retains the existing in-image quality gates. This PR does not deploy, change IAM, rotate credentials, or claim a successful live rollout.

## Jenkins migration, prerequisite and runtime configuration

This PR is stacked on [security PR #112](https://github.com/topcoder-platform/freeCodeCamp/pull/112), which supplies the patched API dependencies and non-root runtime. Merge it into dev, retarget this PR to dev, and promote both to the existing `prod` branch. There is no master branch. OIDC trust and both checkout/configuration refs bind exactly to `prod` for production.

Disable the Jenkins release job and remove its global Auth0/AWS bindings. The old Jenkinsfile fetched a secret `.env` artifact from S3, baked it into the API image and also deployed the frontend. The replacement CircleCI workflow releases the ECS API only. **Before merging, establish a separate frontend artifact release with its own identity and narrow S3/CloudFront permissions.** This change does not grant S3 or CloudFront access to the ECS deployer and does not claim the frontend release is migrated.

The API now compiles source/curriculum in a credential-free Docker stage, runs API security tests, and installs production API dependencies separately. No `.env` is copied. Startup generates only the public config JSON from runtime environment variables and lets PM2 inherit the existing process environment. Build fixture public URLs are removed from the runtime image.

The observed production task has no secret references: its old image supplies them. An administrator must migrate all required application values from the old configuration into explicitly scoped ECS runtime secret references before rollout, including MongoDB, session/cookie/JWT secrets, Auth0, enabled social/payment integrations and SES credentials where still used. Set the actual public locations, cookie domain, locales and deployment environment too. Choose and review their parameter/secret ARNs in IaC; none have been guessed or fetched here. The execution role alone reads them. Keep the absent task role unless a separately reviewed runtime AWS integration requires one. Verify DB, login, mail, curriculum, API health and rollback in dev before enabling production.

The removed `.npmrc` held only public installation settings. Docker supplies them through environment variables; manual installs need `CYPRESS_INSTALL_BINARY=0 npm ci --ignore-scripts --legacy-peer-deps --install-links` followed by the reviewed compatibility patch command.

Validation: the complete new API image builds; all ten API/compatibility security tests pass inside its build stage. A non-root runtime smoke check verifies `.env` and the build fixture config are absent and generated public JSON excludes private markers. CircleCI and AWS IAM/CloudFormation validation pass. Runtime integration with actual dev settings remains required.
