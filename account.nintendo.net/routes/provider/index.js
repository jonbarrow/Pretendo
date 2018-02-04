let routes = require('express').Router(),
    helpers = require('../../helpers'),
    constants = require('../../constants'),
    database = require('../../db'),
    mailer = require('../../mailer'),
    RateLimit = require('express-rate-limit'),
    randtoken = require('rand-token'),
    json2xml = require('json2xml'),
    bcrypt = require('bcryptjs'),
    moment = require('moment'),
    moment_timezone = require('moment-timezone'),
    puid = require('puid'),
    fs = require('fs-extra');

/**
 * [GET]
 * Replacement for: https://account.nintendo.net/v1/api/provider/service_token/@me
 * Description: Gets service token
 */
routes.get('/service_token/@me', async (request, response) => {
    response.set('Content-Type', 'text/xml');
    response.set('Server', 'Nintendo 3DS (http)');
    response.set('X-Nintendo-Date', new Date().getTime());
	let token = {
		service_token: {
			token: 'pretendo_test'
		}
	}
	return response.send(json2xml(token));
});

module.exports = routes;