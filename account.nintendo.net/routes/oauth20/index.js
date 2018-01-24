let routes = require('express').Router();

/**
 * [GET]
 * Replacement for: https://account.nintendo.net/v1/api/oauth20/access_token/generate
 * Description: Unknown use
 */
routes.get('/access_token/generate', (request, response) => {
    response.send('hello');
});

module.exports = routes;