let constants = require('./constants');

function generatePID() {
    let pid = '';
    for (var i=0;i<8;i++) {
        pid += constants.PID_SORT_LIST.charAt(Math.floor(Math.random() * constants.PID_SORT_LIST.length));
    }
    return pid;
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



module.exports = {
    generatePID: generatePID,
    generateNintendoHashedPWrd: generateNintendoHashedPWrd
}