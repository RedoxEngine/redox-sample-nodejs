/**
* RedoxController.js
*
* @description :: supports receiving and sending data to RedoxEngine
* @help        :: See http://links.sailsjs.org/docs/controllers
*/

//////////////////////////////////////////////////////////
// TODO - populate these values with your 
//        organizations Source and Destination information
//////////////////////////////////////////////////////////
var VERIFICATION_TOKEN = process.env.VERIFICATION_TOKEN || 'dev_token';
var REDOX_API_KEY = process.env.REDOX_API_KEY || 'optionally add key here';
var REDOX_API_SECRET = process.env.REDOX_API_SECRET || 'dev_secret';
//////////////////////////////////////////////////////////

var REDOX_AUTH_URL = process.env.REDOX_AUTH_URL || 'https://api.redoxengine.com/auth/authenticate';
var REDOX_API_URL = process.env.REDOX_API_URL || 'https://api.redoxengine.com/endpoint';

var redox_token = {};

var request = require('request');

module.exports = {
  /**
   * Return the challenge when this endpoint is verified by RedoxEngine
   */
  verifyEndpoint: function (req, res) {
    res.send(req.query.challenge);
  },

  /**
   * Process a transmisison received from RedoxEngine
   */
  receiveTransmission: function (req, res) {
    var transmisison = {
      headers: req.headers,
      body: req.body
    };


    // Ensure the verification token sent in the request header 
    //   matches what was set in RedoxEngine
    if (transmisison.headers['verification-token'] !== VERIFICATION_TOKEN) {
      return res.badRequest('Invalid verification token.');
    }


    // save off the message contents to our database, and let Redox know 
    //   we are ready for the next message
    Transmission.create(transmisison, function (err, t) {
      if (err) {
        sails.log(err);
        return res.badRequest('Error occurred while saving transmission in application.');
      }

      res.ok();
    });
  },

  /**
   * Send a message to RedoxEngine
   */
  sendMessage: function (req, res) {

    // Ensure we have a valid requestToken to use
    requestToken(req.body, function (err, accessToken) {
      if (err) {
        return res.badRequest(err);
      }

      // Validate the contents of the message request
      if (!req.body || !req.body.data) {
        return res.badRequest('No message content provided');
      }

      options = {
        url: REDOX_API_URL,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken
        },
        body: req.body.data,
        json: true
      };

      // Post the request to RedoxEngine and return the result
      request.post(options, function (err, response, body) {
        if (err) {
          return res.badRequest(err);
        }

        var message = {
          headers: response.headers,
          body: body
        };
        
        if (response.statusCode !== 200) {
          return res.send(JSONParser.prettyPrint(message.body));
        }

        // Save the returned message details to our database
        Message.create(message, function (err, m) {
          if (err) {
            sails.log(err);
            return res.badRequest('Error occurred while saving the message in application.');
          }

          res.send(JSONParser.prettyPrint(m.body));
        });
      });
    });
  }
};

/**
 * Request an authentication token from the Redox auth endpoint. 
 * 
 * @param  {Object} body - optionally contains request options
 * @param  {Function} cb
 */
function requestToken(body, cb) {

  // Return the token value if it is still valid
  if (new Date(Date.now()) < new Date(redox_token.expires)) {
    cb(null, redox_token.value);
  }

  // Setup the request for a new token
  var options = {
    url: body.loginUrl || REDOX_AUTH_URL,
    method: 'POST',
    body: {
      apiKey: body.apiKey || REDOX_API_KEY,
      secret: body.secret || REDOX_API_SECRET
    },
    headers: {
      'Content-Type': 'application/json'
    },
    json: true
  };

  if (!options.url || !options.body.apiKey || !options.body.secret) {
    cb('Invalid request, please provide the url, apiKey and secret.');
  }

  // Request a new token from RedoxEngine and save it to the redox_token object
  request.post(options, function (err, response, body) {
    if (err) {
      return cb(err);
    }

    if (response.statusCode !== 200) {
      return cb(response);
    }

    redox_token = {
      value: body.accessToken,
      expires: body.expires
    };

    cb(null, redox_token.value);
  });
}
