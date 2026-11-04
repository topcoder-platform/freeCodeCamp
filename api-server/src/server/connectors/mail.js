const MailConnector = require('loopback/lib/connectors/mail');
const nodemailer = require('nodemailer');
const { SESv2Client, SendEmailCommand } = require('@aws-sdk/client-sesv2');

// Retain LoopBack's Email model/callback contract while using the maintained
// Nodemailer SES transport and AWS credential provider instead of AWS SDK v2.
class SecureMailConnector extends MailConnector {
  setupTransport(setting) {
    if (String(setting.type).toLowerCase() !== 'ses') {
      return super.setupTransport(setting);
    }
    const credentials =
      setting.accessKeyId && setting.secretAccessKey
        ? {
            accessKeyId: setting.accessKeyId,
            secretAccessKey: setting.secretAccessKey,
            ...(setting.sessionToken
              ? { sessionToken: setting.sessionToken }
              : {})
          }
        : undefined;
    const sesClient = new SESv2Client({
      region: setting.region || process.env.AWS_REGION || 'us-east-1',
      ...(credentials ? { credentials } : {})
    });
    const transport = nodemailer.createTransport({
      SES: { sesClient, SendEmailCommand }
    });
    this.transportsIndex[setting.alias || setting.type] = transport;
    this.transports.push(transport);
  }
}

SecureMailConnector.initialize = function (dataSource, callback) {
  dataSource.connector = new SecureMailConnector(dataSource.settings);
  callback();
};
module.exports = SecureMailConnector;
