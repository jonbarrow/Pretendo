let routes = require('express').Router(),
    json2xml = require('json2xml'),
    bcrypt = require('bcryptjs'),
    jwt = require('jsonwebtoken'),
    database = require('../../db'),
    helpers = require('../../helpers'),
    constants = require('../../constants');

/**
 * [GET]
 * Replacement for: https://account.nintendo.net/v1/api/oauth20/access_token/generate
 * Description: Unknown use
 */
routes.all('/access_token/generate', async (request, response) => {
    let POST = request.body,
        headers = request.headers;
    
    if (
        !POST ||
        !POST.grant_type ||
        !['password', 'refresh_token'].includes(POST.grant_type)
    ) {
        let error = {
            errors: {
                error: {
                    cause: 'grant_type',
                    code: '0004',
                    message: 'Invalid Grant Type'
                }
            }
        }

        return response.send(json2xml(error));
    }

    if (POST.grant_type == 'password') {
        if (!POST.user_id || !POST.password) {
            let error = {
                errors: {
                    error: {
                        cause: 'grant_type',
                        code: '0004',
                        message: 'Invalid Grant Type'
                    }
                }
            }
    
            return response.send(json2xml(error));
        }

        let user = await database.user_collection.findOne({
            user_id: POST.user_id
        });

        if (!user) {
            let error = {
                errors: {
                    error: {
                        code: '0113',
                        message: 'Unauthorized device'
                    }
                }
            }

            return response.send(json2xml(error));
        }

        if (!POST.password_type || POST.password_type.toLowerCase() !== 'hash') {
            POST.password = helpers.generateNintendoHashedPWrd(POST.password, user.pid);
        }

        if (!bcrypt.compareSync(POST.password, user.sensitive.password)) {
            let error = {
                errors: {
                    error: {
                        code: '0106',
                        message: 'Invalid account ID or password'
                    }
                }
            }

            return response.send(json2xml(error));
        }
        
        let access_token = helpers.generateAccessToken({
            pid: user.pid
        });

        let refresh_token = helpers.generateRefreshToken({
            pid: user.pid
        });

        user.sensitive.tokens.refresh = refresh_token;

        await database.user_collection.update({
            pid: user.pid
        }, {
            $set: {
                sensitive: user.sensitive
            }
        });
        
        response.send(json2xml({
            OAuth20: {
                access_token: {
                    token: access_token,
                    refresh_token: refresh_token,
                    expires_in: 3600,
                }
            }
        }));
    } else if (POST.grant_type == 'refresh_token') {
        if (!POST.refresh_token) {
            let error = {
                errors: {
                    error: {
                        cause: 'refresh_token',
                        code: '0106',
                        message: 'Invalid Refresh Token'
                    }
                }
            }

            return response.send(json2xml(error));
        }

        let payload;

        try {
            payload = jwt.verify(POST.refresh_token, constants.JWT_TOKEN_CERTS.REFRESH.public);
        } catch (err) {
            let error = {
                errors: {
                    error: {
                        cause: 'refresh_token',
                        code: '0106',
                        message: 'Invalid Refresh Token'
                    }
                }
            }

            return response.send(json2xml(error));
        }

        if (payload.data.type.toLowerCase() !== 'refresh_token') {
            let error = {
                errors: {
                    error: {
                        cause: 'refresh_token',
                        code: '0106',
                        message: 'Invalid Refresh Token'
                    }
                }
            }

            return response.send(json2xml(error));
        }

        let user = database.user_collection.findOne({
            pid: payload.data.payload.pid
        });

        if (!user || user.sensitive.tokens.refresh !== POST.refresh_token) {
            let error = {
                errors: {
                    error: {
                        cause: 'refresh_token',
                        code: '0106',
                        message: 'Invalid Refresh Token'
                    }
                }
            }

            return response.send(json2xml(error));
        }

        let access_token = helpers.generateAccessToken({
            pid: user.pid
        });

        let refresh_token = helpers.generateRefreshToken({
            pid: user.pid
        });

        user.sensitive.tokens.refresh = refresh_token;

        await database.user_collection.update({
            pid: user.pid
        }, {
            $set: {
                sensitive: user.sensitive
            }
        });

        
        response.send(json2xml({
            OAuth20: {
                access_token: {
                    token: access_token,
                    refresh_token: refresh_token,
                    expires_in: 3600,
                }
            }
        }));
    }

});

module.exports = routes;