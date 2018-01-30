let constants = require('./constants'), 
    database = require('./db'),
    jwt = require('jsonwebtoken');

async function generatePID() {
    let pid = '';

    for (var i=0;i<10;i++) {
        pid += constants.PID_SORT_LIST.charAt(Math.floor(Math.random() * constants.PID_SORT_LIST.length));
    }

    let does_pid_inuse = await database.user_collection.findOne({
        pid: pid
    });

    if (does_pid_inuse) {
        return await generatePID();
    }

    return pid;
}

function generateRandID(length = 10) {
    let id = '';

    for (var i=0;i<length;i++) {
        id += constants.PID_SORT_LIST.charAt(Math.floor(Math.random() * constants.PID_SORT_LIST.length));
    }

    return id;
}

function generateNintendoHashedPWrd(password, pid) {
    let buff1 = require('python-struct').pack('<I', pid);
    let buff2 = Buffer.from(password).toString('ascii');

    let unpacked = new Buffer(bufferToHex(buff1) + '\x02eCF' + buff2, 'ascii'),
        hashed = require('crypto').createHash('sha256').update(unpacked).digest().toString('hex');

    return hashed;
}

function bufferToHex(buff) {
    let result = '',
        arr = buff.toString('hex').match(/.{1,2}/g);
    for (var i=0;i<arr.length;i++) {
        let char = arr[i],
            char_code = char.charCodeAt();
        result += String.fromCharCode(parseInt(char, 16));
    }
    result.replace(/\\/g, '&#92;');
    return result;
}

async function doesUserExist(username) {
    let user = await database.user_collection.findOne({
        username: username.toLowerCase()
    });
    
    if (user) {
        return true;
    }

    return false;
}


function generateAccessToken(payload) {
    let token = jwt.sign({
        data: {
            type: 'auth_token',
            payload: payload
        }
    }, {
        key: constants.JWT_TOKEN_CERTS.ACCESS.secret,
        passphrase: constants.JWT_TOKEN_CERTS.ACCESS.passphrase
    }, {
        algorithm: 'RS256',
        expiresIn: 3600
    });

    return token;
}

function generateRefreshToken(payload) {
    let token = jwt.sign({
        data: {
            type: 'refresh_token',
            payload: payload
        }
    }, {
        key: constants.JWT_TOKEN_CERTS.REFRESH.secret,
        passphrase: constants.JWT_TOKEN_CERTS.REFRESH.passphrase
    }, { algorithm: 'RS256'});

    return token;
}


module.exports = {
    generatePID: generatePID,
    generateRandID: generateRandID,
    generateNintendoHashedPWrd: generateNintendoHashedPWrd,
    doesUserExist: doesUserExist,
    generateAccessToken: generateAccessToken,
    generateRefreshToken: generateRefreshToken,
}