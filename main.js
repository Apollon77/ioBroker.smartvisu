/**
 * SMartVISU Adapter
 */

 /* jshint -W097 */
 // jshint strict:true
 /*jslint node: true */
 /*jslint esversion: 6 */
'use strict';

const utils = require('@iobroker/adapter-core'); // Get common adapter utils
const path = require('path');
const fs = require('fs');
const dataDir = utils.getAbsoluteDefaultDataDir();

const recCopy = require('recursive-copy');

const express = require('express');
const sphp = require('sphp');

const app = express();
let serving = false;

const adapter = new utils.Adapter('smartvisu');

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
    if (adapter && adapter.log) {
        adapter.log.warn('Exception: ' + err);
    }
    shutdownServer();
});

adapter.on('ready', function () {
    main();
});


function installSmartVisu(callback) {
    const distDir = __dirname + '/dist/';

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

/*function patchSPhp() {
    var fs = require('fs');
    var path;
    try {
        path = require.resolve('sphp');
    } catch (e) {

    }

    if (path) {
        path = path.replace(/\\/g, '/');
        path = path.substring(0, path.lastIndexOf('/') + 1);
    }

    if (fs.existsSync(path)) {
        try {
            fs.writeFileSync(path + 'sphp.js', fs.readFileSync(__dirname + '/sphp-patch/sphp.js'));
            adapter.log.info('Patch sphp applied');
        } catch (e) {
            console.error('Cannot update sphp.js: ' + e);
        }
        try {
            fs.writeFileSync(path + 'php_worker.php', fs.readFileSync(__dirname + '/sphp-patch/php_worker.php'));
            adapter.log.info('Patch php_worker applied');
        } catch (e) {
            console.error('Cannot update php_worker.php: ' + e);
        }
    }
}*/

function serveSmartVisu() {
    var options = {};
    options.docRoot = adapter.config.docRoot;
    if (adapter.config.phpCgiPath) {
        options.cgiEngine = adapter.config.phpCgiPath;
        adapter.log.info('Use PHP-CGI: ' + adapter.config.phpCgiPath);
    }

    var serverPort = parseInt(adapter.config.serverPort, 10);
    var server = app.listen(adapter.config.serverPort, function() {
        adapter.log.info('SmartVISU Server started on port ' + adapter.config.serverPort + ' with Doc-Root ' + adapter.config.docRoot);
        serving = true;
    });

    app.use(sphp.express(options));
    app.use(express.static(adapter.config.docRoot));
}


function main() {
    //patchSPhp();
    adapter.config.docRoot = adapter.config.docRoot || adapter.namespace.replace('.','_');
    adapter.config.docRoot = adapter.config.docRoot.replace(/\\/g, '/');

    // remove last "/"
    if (adapter.config.docRoot[adapter.config.docRoot.length - 1] === '/') {
        adapter.config.docRoot = adapter.config.docRoot.substring(0, adapter.config.docRoot.length - 1);
    }

    if (adapter.config.docRoot[0] !== '/' && !adapter.config.docRoot.match(/^\w:\//)) {
        adapter.config.docRoot = path.join(dataDir, adapter.config.docRoot);
    }
    adapter.config.docRoot += path.sep;

    installSmartVisu(function() {
        serveSmartVisu();
    });
}
