var oauth2 = require('coviu-sdk-oauth2');
var request = require('coviu-sdk-http/request');
var api = require('coviu-sdk-api');

var defaults = {
  endpoint: 'https://api.coviu.com/v1',
  interpreter: require('coviu-sdk-http/request-interpreter'),
  debug: false
};

/* Instantiate the sdk
 * @param: apiKey - String, the api key created for your coviu account
 * @param: keySecret - String, the key secret created for your api key.
 * @param: opt - optional options {
 *    endpoint: optional string for the api base endpoint,
 *    debug: optional boolean if true, enables payload and query validation before executing http requests.
 *    interpret: optional coviu-sdk-http compliant request interpreter
 * }
 * @return: an object that exposes each of the api methods, automatically wrapped in appropriate
 * authentication and error handling behaviour.
 */
module.exports = function(apiKey, keySecret, opts) {
  var endpoint = (opts || {}).endpoint || defaults.endpoint;
  var interpreter = (opts || {}).interpreter || defaults.interpreter;
  var debug = (typeof (opts || {}).debug === 'undefined') ? defaults.debug : opts.debug;
  var base = request.request(endpoint).interpreter(interpreter).debug(debug);
  var client = oauth2.OAuth2Client(apiKey, keySecret, base);
  var service = base.auth(client.getClientAuth);
  return api(service);
}
