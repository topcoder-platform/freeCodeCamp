const { ProxyAgent } = require('proxy-agent-engine');

// gatsby-plugin-s3 uses proxy-agent's old callable URL constructor.
module.exports = function proxyAgent(url) {
  if (typeof url !== 'string')
    throw new TypeError('Proxy URL must be a string');
  return new ProxyAgent({ getProxyForUrl: () => url });
};
