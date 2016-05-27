var http = require('http');
var httpProxy = require('http-proxy');

var config = require('./config.json');

var proxies = {};

for (var i = 0; i < config.hosts.length; i++) {
    var host = config.hosts[i];
    proxies[host.name] = new httpProxy.createProxyServer({
        target: {
            host: host.host,
            port: host.port
        },
        xfwd: (host.xfwd ? true : false)
    });
}

http.createServer(function(req, res) {
    var path = require('url').parse(req.url).path;
    config.hosts.forEach(function(host){
        if (path.indexOf(host.prefix) >= 0) {
            proxies[host.name].proxyRequest(req, res);
            proxies[host.name].on('error', function(err, req, res) {
                if (err) console.log(err);
                    res.writeHead(500);
                    res.end('Oops, something went very wrong...');
            });
        }
    });
}).listen(8080);