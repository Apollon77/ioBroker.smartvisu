/**
 * SMartVISU Adapter
 */

/* jshint -W097 */
// jshint strict:false
/*jslint node: true */
'use strict';

var utils = require(__dirname + '/lib/utils'); // Get common adapter utils
var path = require('path');
var fs = require('fs');
var dataDir = path.normalize(utils.controllerDir + path.sep + require(utils.controllerDir + path.sep + 'lib' + path.sep + 'tools').getDefaultDataDir());

var recCopy = require('recursive-copy');

var express = require('express');
var sphp = require('sphp');

var app = express();
var serving = false;

var adapter = new utils.Adapter('smartvisu');

function shutdownServer(callback) {
    try {
        if (serving) {
            app.close();
            adapter.log.info('SmartVISU Server stopped');
        }
        if (callback) callback();
    } catch (e) {
        if (callback) callback();
    }
}

adapter.on('unload', function (callback) {
    shutdownServer(callback);
});

process.on('SIGINT', function () {
    shutdownServer();
});

process.on('uncaughtException', function (err) {
    adapter.log.warn('Exception: ' + err);
    shutdownServer();
});

adapter.on('ready', function () {
    main();
});


function installSmartVisu(callback) {
    var distDir = __dirname + '/dist/';

    if (! fs.existsSync(adapter.config.docRoot)) {
        adapter.log.info('DocRoot do not exists, we need to create and initially copy files');
        recCopy(distDir, adapter.config.docRoot, function(error, results) {
        	if (error) {
        		adapter.log.error('Copy failed: ' + error);
        	} else {
                //adapter.log.info(JSON.stringify(results));
                adapter.log.info('Copied ' + results.length + ' files to ' + adapter.config.docRoot);
                callback();
        	}
        });
    }
    else {
        adapter.log.info('DocRoot already exists, so do not copy over for now');
        callback();
    }
}

function serveSmartVisu() {
    if (adapter.config.phpCgiPath) {
        sphp.cgiEngine = adapter.config.phpCgiPath;
        adapter.log.info('Use PHP-CGI: ' + adapter.config.phpCgiPath);
    }

    var serverPort = parseInt(adapter.config.serverPort, 10);
    var server = app.listen(adapter.config.serverPort, function() {
        adapter.log.info('SmartVISU Server started on port ' + adapter.config.serverPort + ' with Doc-Root ' + adapter.config.docRoot);
        serving = true;
    });

    app.use(sphp.express(adapter.config.docRoot));
    app.use(express.static(adapter.config.docRoot));
}


function main() {
    adapter.config.docRoot = adapter.config.docRoot || adapter.namespace.replace('.','_');
    adapter.config.docRoot = adapter.config.docRoot.replace(/\\/g, '/');

    // remove last "/"
    if (adapter.config.docRoot[adapter.config.docRoot.length - 1] === '/') {
        adapter.config.docRoot = adapter.config.docRoot.substring(0, adapter.config.docRoot.length - 1);
    }

    if (adapter.config.docRoot[0] !== '/' && !adapter.config.docRoot.match(/^\w:\//)) {
        adapter.config.docRoot = dataDir + adapter.config.docRoot;
    }
    adapter.config.docRoot += path.sep;

    installSmartVisu(function() {
        serveSmartVisu();
    });
}
