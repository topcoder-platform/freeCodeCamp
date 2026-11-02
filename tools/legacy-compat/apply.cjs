const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const fromApi = createRequire(
  path.resolve(__dirname, '../../api-server/package.json')
);
const fromClient = createRequire(
  path.resolve(__dirname, '../../client/package.json')
);
function packageRoot(name) {
  try {
    return path.dirname(fromApi.resolve(`${name}/package.json`));
  } catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND') throw error;
    return path.dirname(fromClient.resolve(`${name}/package.json`));
  }
}
function replace(file, before, after) {
  const source = fs.readFileSync(file, 'utf8');
  if (source.includes(after)) return;
  if (!source.includes(before))
    throw new Error(`Legacy compatibility patch no longer matches ${file}`);
  fs.writeFileSync(file, source.replace(before, after));
}
// These packages import UUID 3's private files. Keep UUID 11's patched generator
// and retain the LDAP formatter separately so existing identity keys are stable.
const passportRoot = packageRoot('@freecodecamp/loopback-component-passport');
fs.copyFileSync(
  path.join(__dirname, 'bytes-to-uuid.cjs'),
  path.join(passportRoot, 'lib/bytes-to-uuid.cjs')
);
replace(
  path.join(passportRoot, 'lib/passport-configurator.js'),
  "require('uuid/lib/bytesToUuid')",
  "require('./bytes-to-uuid.cjs')"
);
const jaysonRoot = packageRoot('jayson');
for (const file of [
  'lib/utils.js',
  'lib/client/browser.js',
  'lib/generateRequest.js'
]) {
  replace(
    path.join(jaysonRoot, file),
    "require('uuid/v4')",
    "require('uuid').v4"
  );
}

// Enzyme's browser curriculum runner imports a private Cheerio entry point.
// Use the public equivalent and create an explicit empty document with Cheerio 1.
let enzymeRoot;
try {
  enzymeRoot = packageRoot('enzyme');
} catch (error) {
  if (error.code !== 'MODULE_NOT_FOUND') throw error;
}
if (enzymeRoot) {
  const utils = path.join(enzymeRoot, 'build/Utils.js');
  replace(
    utils,
    'var _cheerio2 = _interopRequireDefault(_cheerio);',
    'var _cheerio2 = { default: _cheerio };'
  );
  replace(utils, "require('cheerio/lib/utils')", "require('cheerio/utils')");
  replace(
    utils,
    "_cheerio2['default'].root()",
    "_cheerio2['default'].load('').root()"
  );
}

for (const [name, files] of Object.entries({
  'webpack-log': ['src/index.js']
})) {
  let root;
  try {
    root = packageRoot(name);
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') continue;
    throw error;
  }
  for (const file of files) {
    const target = path.join(root, file);
    let source = fs.readFileSync(target, 'utf8');
    if (
      !/require\(['"]uuid\/v[1-5]['"]\)/.test(source) &&
      !/require\(['"]uuid['"]\)\.v[1-5]/.test(source)
    ) {
      throw new Error(`Legacy UUID patch no longer matches ${target}`);
    }
    source = source.replace(
      /require\((['"])uuid\/(v[1-5])\1\)/g,
      'require($1uuid$1).$2'
    );
    fs.writeFileSync(target, source);
  }
}

let httpAuthRoot;
try {
  httpAuthRoot = packageRoot('http-auth');
} catch (error) {
  if (error.code !== 'MODULE_NOT_FOUND') throw error;
}
if (httpAuthRoot) {
  replace(
    path.join(httpAuthRoot, 'src/auth/digest.js'),
    "const uuid = require('uuid');",
    "const uuid = require('uuid').v4;"
  );
}

// These older callers use Got 9's JSON response flag. Got 11 keeps the callable
// API and fixes redirect handling, but names this option responseType.
for (const [name, file] of [
  ['package-json', 'index.js'],
  ['git-win', 'lib/get-release.js']
]) {
  let root;
  try {
    root = packageRoot(name);
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') continue;
    throw error;
  }
  replace(path.join(root, file), 'json: true', "responseType: 'json'");
}

// Gatsby's plugin imports private Webpack paths that moved in patched Webpack.
// The public exports refer to the same classes.
let gatsbyRoot;
try {
  gatsbyRoot = packageRoot('gatsby');
} catch (error) {
  if (error.code !== 'MODULE_NOT_FOUND') throw error;
}
if (gatsbyRoot) {
  const plugin = path.join(
    gatsbyRoot,
    'dist/utils/webpack/plugins/partial-hydration.js'
  );
  replace(
    plugin,
    'require("webpack/lib/Template")',
    'require("webpack").Template'
  );
  replace(
    plugin,
    'require("webpack/lib/dependencies/ModuleDependency")',
    'require("webpack").dependencies.ModuleDependency'
  );
}
