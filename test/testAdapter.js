/* jshint -W097 */// jshint strict:false
/*jslint node: true */
var expect = require('chai').expect;
var setup  = require(__dirname + '/lib/setup');
var request = require('request');
var objects = null;
var states  = null;
var onStateChanged = null;
var onObjectChanged = null;
var sendToID = 1;

var adapterShortName = setup.adapterName.substring(setup.adapterName.indexOf('.')+1);

function checkConnectionOfAdapter(cb, counter) {
    counter = counter || 0;
    console.log('Try check #' + counter);
    if (counter > 30) {
        if (cb) cb('Cannot check connection');
        return;
    }

    states.getState('system.adapter.' + adapterShortName + '.0.alive', function (err, state) {
        if (err) console.error(err);
        if (state && state.val) {
            if (cb) cb();
        } else {
            setTimeout(function () {
                checkConnectionOfAdapter(cb, counter + 1);
            }, 1000);
        }
    });
}

function checkValueOfState(id, value, cb, counter) {
    counter = counter || 0;
    if (counter > 20) {
        if (cb) cb('Cannot check value Of State ' + id);
        return;
    }

    states.getState(id, function (err, state) {
        if (err) console.error(err);
        if (value === null && !state) {
            if (cb) cb();
        } else
        if (state && (value === undefined || state.val === value)) {
            if (cb) cb();
        } else {
            setTimeout(function () {
                checkValueOfState(id, value, cb, counter + 1);
            }, 500);
        }
    });
}

function sendTo(target, command, message, callback) {
    onStateChanged = function (id, state) {
        if (id === 'messagebox.system.adapter.test.0') {
            callback(state.message);
        }
    };

    states.pushMessage('system.adapter.' + target, {
        command:    command,
        message:    message,
        from:       'system.adapter.test.0',
        callback: {
            message: message,
            id:      sendToID++,
            ack:     false,
            time:    (new Date()).getTime()
        }
    });
}

describe('Test ' + adapterShortName + ' adapter', function() {
    before('Test ' + adapterShortName + ' adapter: Start js-controller', function (_done) {
        this.timeout(600000); // because of first install from npm

        setup.setupController(async function () {
            var config = await setup.getAdapterConfig();
            // enable adapter
            config.common.enabled  = true;
            config.common.loglevel = 'silly';

            config.native.serverPort = 20000;
            if (process.env.PHP_PATH && process.env.PHP_PATH !== "") {
                config.native.phpCgiPath = process.env.PHP_PATH;
            }

            await setup.setAdapterConfig(config.common, config.native);

            setup.startController(true, function(id, obj) {}, function (id, state) {
                    if (onStateChanged) onStateChanged(id, state);
                },
                function (_objects, _states) {
                    objects = _objects;
                    states  = _states;
                    _done();
                });
        });
    });

    it('Test ' + adapterShortName + ' adapter: Check if adapter started', function (done) {
        this.timeout(120000);
        checkConnectionOfAdapter(function (res) {
            if (res) console.log(res);
            expect(res).not.to.be.equal('Cannot check connection');
            objects.setObject('system.adapter.test.0', {
                    common: {

                    },
                    type: 'instance'
                },
                function () {
                    states.subscribeMessage('system.adapter.test.0');
                    setTimeout(done, 60000);
                });
        });
    });

    it('Test ' + adapterShortName + ' adapter: Get phpinfo()', function (done) {
        this.timeout(10000);
        request('http://127.0.0.1:20000/phpinfo.php', function (error, response, body) {
            //console.log('BODY: ' + body);
            expect(error).to.be.not.ok;
            expect(body.indexOf('<title>phpinfo()</title>')).to.be.not.equal(-1);
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    it('Test ' + adapterShortName + ' adapter: Get base.php', function (done) {
        this.timeout(10000);
        request('http://127.0.0.1:20000/lib/base/base.php', function (error, response, body) {
            //console.log('BODY: ' + body);
            expect(error).to.be.not.ok;
            expect(body.indexOf('* J A V A S C R I P T   D Y N A M I C   E X T E N T I O N S')).to.be.not.equal(-1);
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    after('Test ' + adapterShortName + ' adapter: Stop js-controller', function (done) {
        this.timeout(10000);

        setup.stopController(function (normalTerminated) {
            console.log('Adapter normal terminated: ' + normalTerminated);
            done();
        });
    });
});
