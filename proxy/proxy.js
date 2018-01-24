/*
Proxy example ripped from `http-proxy` GH repo.
Maybe can be modified to proxy requests to custom servers without patching NAND?
*/

/*
let port = 8213, 
    http = require('http'),
    net = require('net'),
    httpProxy = require('http-proxy'),
    url = require('url'),
    util = require('util'),
    colors = require('colors');

let proxy = httpProxy.createServer();

let server = http.createServer((request, response) => {
    proxy.web(request, response, {target: request.url, secure: false});
}).listen(port, () => {
    console.log('Proxy server starting on '.cyan + String(port).yellow);
});

server.on('connect', (request, socket) => {
    let serverUrl = url.parse('https://' + request.url);

    let srvSocket = net.connect(serverUrl.port, serverUrl.hostname, () => {
        socket.write(
            'HTTP/1.1 200 Connection Established\r\n' +
            'Proxy-agent: Node-Proxy\r\n' +
            '\r\n'
        );
        srvSocket.pipe(socket);
        socket.pipe(srvSocket);
    });
});
*/

let proxy = require('proxy-tamper').start({port: 8080});

proxy.tamper(/block/, 'This content is blocked!');