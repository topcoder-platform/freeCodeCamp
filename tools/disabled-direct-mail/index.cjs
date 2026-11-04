// The API configures SES or authenticated SMTP; never fall back to direct MX delivery.
module.exports = function () {
  throw new Error('Direct mail delivery is disabled. Configure SES or SMTP.');
};
