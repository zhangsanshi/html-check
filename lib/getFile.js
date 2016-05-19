module.exports = getFile;

var url = require('url'),
    Q = require('q'),
    path = require('path'),
    https = require('https'),
    BufferHelper = require('bufferhelper'),
    fs = require('fs'),
    http = require('http');


var HTTP_REG = /^http[s]*/,
    HTTPS = 'https:';

function getRequest(protocol) {

    if (protocol == HTTPS) {

        return https;

    } else {

        return http;

    }
}


function fileExists(filePath) {

    try {

        return fs.statSync(filePath).isFile();

    } catch (e) {

        if (e.code == 'ENOENT') {
            console.log("File does not exist.");
            return false;
        }

        console.log("Exception fs.statSync (" + path + "): " + e);

        throw e;
    }
}

function getFile(src) {

    var deferred = Q.defer();

    if (HTTP_REG.test(src)) {

        var urlObj = url.parse(src),
            search = urlObj.search,
            link = '';

        urlObj.search = ((search ? search + '&' : '?') + (new Date() - 0));

        link = url.format(urlObj);

        getRequest(urlObj.protocol).get(link, function (res) {

            console.log("Got response: " + res.statusCode);

            var bufferHelper = new BufferHelper();

            res.on('data', function (chunk) {
                bufferHelper.concat(chunk);
            });

            res.on('end', function () {
                var file = bufferHelper.toBuffer().toString();
                deferred.resolve(file);
            });

        }).on('error', function (e) {

            deferred.reject(new Error(e));
            console.log('Got error' + e.message);

        });

    } else if (fileExists(src)) {

        fs.readFile(src, function (err, data) {

            if (err) {

                throw err;
            }

            deferred.resolve(data);
        });

    } else {

        deferred.resolve(src);

    }
    return deferred.promise;
}