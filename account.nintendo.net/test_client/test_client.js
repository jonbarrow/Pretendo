let https = require('https'),
    http = require('http'),
    querystring = require('querystring'),
    url = require('url'),
    fs = require('fs'),
    XML = require('pixl-xml'),
    cert = {
        key: fs.readFileSync(__dirname + '/ssl/nintendo/wiiu-common.key'),
        cert: fs.readFileSync(__dirname + '/ssl/nintendo/wiiu-common.crt')
    },
    accountxml = fs.readFileSync(__dirname + '/account.xml');

const HEADERS = {
    'X-Nintendo-Platform-ID': '1',
    'X-Nintendo-Device-ID': '1152786973',
    'X-Nintendo-Serial-Number': 'FW414239263',
    'X-Nintendo-Region': '2',
    'X-Nintendo-Client-ID': 'a2efa818a34fa16b8afbc8a74eba3eda',
    'X-Nintendo-Client-Secret': 'c91cdb5658bd4954ade78533a339cf9a',
    'X-Nintendo-Device-Cert': 'AAEABQAs8l69crZSO95k8aL5qqc7Irs9l2gXkNOiAdPhjgBF/WvaC8xQULYzj1o85tAYIyp0+2SlbxGRS67SlQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSb290LUNBMDAwMDAwMDMtTVMwMDAwMDAxMgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAk5HNDRiNjIyMWQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB2pA7mAK7H8q9JQZF5khsbbpRMaKJfmnQhc0lusoWbDFaPAeWE5Z8ZzKH0MkzSCh3kPYmCYNEHR4b9TtPDLDMSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    'Content-type': 'application/xml'
}

let options = {
    method: 'POST',
    key: cert.key,
    cert: cert.cert,
    rejectUnauthorized: false,
    //port: 443,
    headers: HEADERS
};

let payload = accountxml;

apiPostRequest('http://account.riiu.net/v1/api/people/', payload, options, (body) => {
    console.log(XML.parse(body));
});

function apiPostRequest(uri, payload, options, cb) {
    let api_url = new url.URL(uri);

    options.host = api_url.hostname;
    options.path = api_url.pathname;

    let port = options.port || 80,
        handler = http;

    if (port == 443) {
        handler = https;
    }

    let end_buffer = '';
    
    let request = handler.request(options, (response) => {
        var data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });
        
        response.on('end', () => {
            cb(data);
        });
    });

    request.on('error', (error) => {
        throw new Error(error)
    });
    
    request.write(payload);
    request.end();
}