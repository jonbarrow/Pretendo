/*
'use strict';

require('greenlock-express').create({
    server: 'staging',
    email: 'john.doe@example.com',
    agreeTos: true,
    debug: true,
    approveDomains: [
        'example.com',
        'localhost',
        'defirestudios.com'
    ],
    app: require('express')().use('/', function (req, res) {
        res.end('Hello, World!');
    })
}).listen(80, 443);
*/

//////////////////////////////////////////////////////////////////
///                                                            ///
///                        Dependencies                        ///
///                                                            ///
//////////////////////////////////////////////////////////////////

let port = 80,
    path = require('path'),
    express = require('express'),
    subdomain = require('express-subdomain')
    colors = require('colors'),
    morgan = require('morgan'),
    app = express(),
    router = express.Router();

// API routes
const ROUTES = {
    CONTENT: require('./routes/content'),
    DEVICES: require('./routes/devices'),
}

// START APPLICATION

// Create normal router
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// Create API router
app.use(morgan('dev'));
router.use(express.json());
router.use(express.urlencoded({
    extended: true
}));

// Create subdomain
app.use(subdomain('account', router));

// Setup routes
router.use('/v1/api/content', ROUTES.CONTENT); // content API routes
router.use('/v1/api/devices', ROUTES.DEVICES); // device API routes

// 404 handler
router.use((request, response) => {
    response.status(404);
    response.send();
});

// non-404 error handler
router.use((error, request, response) => {
    let status = error.status || 500;
    response.status(status);
    response.json({
        app: 'api',
        status: status,
        error: error.message
    });
});

// Starts the server
app.listen(port, () => {
    console.log('Server'.blue + ' started '.green.bold + 'on port '.blue + new String(port).yellow);
});