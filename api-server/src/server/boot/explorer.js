const createDebugger = require('debug');
const log = createDebugger('fcc:boot:explorer');

module.exports = function mountLoopBackExplorer(app) {
  if (process.env.FREECODECAMP_NODE_ENV === 'production') return;
  let swagger;
  let ui;
  try {
    swagger = require('loopback-swagger');
    ui = require('swagger-ui-dist');
  } catch (err) {
    if (err.code !== 'MODULE_NOT_FOUND') throw err;
    app.once('started', () =>
      log('Install development dependencies to enable the API explorer.')
    );
    return;
  }
  const router = app.loopback.Router();
  router.get('/swagger.json', (req, res) => {
    res.json(
      swagger.generateSwaggerSpec(app, { basePath: app.get('restApiRoot') })
    );
  });
  router.get('/swagger-initializer.js', (req, res) => {
    res
      .type('js')
      .send(
        'window.onload = function () { window.ui = SwaggerUIBundle({ url: "./swagger.json", dom_id: "#swagger-ui", presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset], layout: "StandaloneLayout", validatorUrl: null }); };'
      );
  });
  router.use(app.loopback.static(ui.getAbsoluteFSPath()));
  app.use('/explorer', router);
};
