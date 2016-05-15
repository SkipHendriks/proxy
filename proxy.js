var http = require('http');
var httpProxy = require('http-proxy');

var proxy_timeservice = new httpProxy.createProxyServer({
    target: {
        host: 'localhost',
        port: 8081
    }
});

var proxy_test = new httpProxy.createProxyServer({
    target: {
        host: 'localhost',
        port: 8082
    }
});

http.createServer(function(req, res) {
    if (req.headers.host === 'http://www.domain.com') {
        proxy_timeservice.proxyRequest(req, res);
        proxy_timeservice.on('error', function(err, req, res) {
            if (err) console.log(err);
            res.writeHead(500);
            res.end('Oops, something went very wrong...');
        });
    } else if (req.headers.host === 'http://api.domain.com') {
        proxy_test.proxyRequest(req, res);
        proxy_test.on('error', function(err, req, res) {
            if (err) console.log(err);
            res.writeHead(500);
            res.end('Oops, something went very wrong...');
        });
    }
}).listen(8080);