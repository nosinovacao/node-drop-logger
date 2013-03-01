var EventEmitter = require('events').EventEmitter;
/**
 * Initialize a `NodeLogger` with the given log `level` defaulting to 'DEBUG'.
 * 
 * @param {Object} options
 * {
 *  @property {Number} level [Optional  (default = 'DEBUG') | Options = [EMERGENCY|ALERT|CRITICAL|ERROR|WARNING|NOTICE|INFO|DEBUG]]
 *  @property {Bool} useConsole [Optional (default = false)]
 *  @property {Bool} useFile [Optional (default = false)]
 *  @property {string} filePath [if useFile Mandatory (default = null) | '/Logs/FTPProxy-Logging(%DATE%).log']
 * }
 * @api public
 */
var NodeLogger = function (options) {
    var fs = require('fs');
    var _p = {
        'currentDate': '',
        'logger': null,
        'filePath': null,
        'stream': null,
        'level': 'DEBUG',
        'useFile': false,
        'useConsole': false,
        'init': function () {
            if ('string' == typeof options.level) options.level = self.levels[options.level.toUpperCase()];
            _p.useConsole = options.useConsole || false;
            _p.useFile = options.useFile || false;
            _p.filePath = options.filePath || null;
            _p.level = options.level || 'DEBUG';

            if (_p.useFile === true && _p.filePath) _p.setFileLogger(); 
            return self;
        },
        'setFileLogger': function () {
            _p.currentDate = new Date().toDateString();
            var fileName = _p.getFileName(new Date());
            _p.stream = fs.createWriteStream(fileName, { flags: 'a' });
            if (_p.stream.readable) self.read();
        },
        'getFileName': function (date)
        {
            return _p.filePath.replace('%DATE%', date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());
        }
    };
    var self = {
        'levels': {
            'EMERGENCY' : 0,    //System is unusable. @type Number
            'ALERT'     : 1,    //Action must be taken immediately. @type Number
            'CRITICAL'  : 2,    //Critical condition. @type Number
            'ERROR'     : 3,    //Error condition. @type Number
            'WARNING'   : 4,    //Warning condition. @type Number
            'NOTICE'    : 5,    //Normal but significant condition. @type Number
            'INFO'      : 6,    //Purely informational message. @type Number
            'DEBUG'     : 7     //Application debug messages. @type Number
        },
        'emergency': function (msg, isError) { self.log('EMERGENCY', msg, isError); },
        'alert': function (msg, isError) { self.log('ALERT', msg, isError); },
        'critical': function (msg, isError) { self.log('CRITICAL', msg, isError); },
        'error': function (msg, isError) { self.log('ERROR', msg, isError); },
        'warning': function (msg, isError) { self.log('WARNING', msg, isError); },
        'notice': function (msg, isError) { self.log('NOTICE', msg, isError); },
        'info': function (msg, isError) { self.log('INFO', msg, isError); },
        'debug': function (msg, isError) { self.log('DEBUG', msg, isError); },
        'log': function (levelStr, msg, isError) {
            if (_p.currentDate != new Date().toDateString()) { _p.setFileLogger(); }
            if (self.levels[levelStr.toUpperCase()] <= _p.level) {
                var i = 1;
                
                var now = new Date();
                var dateStr = now.getFullYear() + "-" + (1 + now.getMonth()) + "-" + now.getDate() + " " +
                                      now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
                msg = '[' + dateStr + ']' + ' ' + levelStr + ' ' + msg; 
                if (_p.useConsole) {
                    switch (levelStr) {
                        case 'ERROR': console.error(msg); break;
                        case 'WARNING': console.warn(msg); break;
                        case 'INFO': console.info(msg); break;
                        case 'DEBUG': console.log(msg); break;
                        default: console.log(msg); break;
                    }
                }
                if (_p.useFile) { _p.stream.write(msg + '\r\n'); }
                if (isError) console.trace("Trace follows");
            }
        },
        'read': function () { //Start emitting "line" events. @api public
            if (_p.useFile) { 
                var buf = ''
                  , stream = _p.stream;
                stream.setEncoding('utf8');
                stream.on('data', function (chunk) {
                    buf += chunk;
                    if ('\n' != buf[buf.length - 1]) return;
                    buf.split('\n').map(function (line) {
                        if (!line.length) return;
                        try {
                            var captures = line.match(/^\[([^\]]+)\] (\w+) (.*)/);
                            var obj = {
                                date: new Date(captures[1])
                              , level: exports[captures[2]]
                              , levelString: captures[2]
                              , msg: captures[3]
                            };
                            self.emit('line', obj);
                        } catch (err) {
                            // Ignore
                        }
                    });
                    buf = '';
                });

                stream.on('end', function () {
                    self.emit('end');
                });
            }
        }
    };
    return _p.init();
};

NodeLogger.prototype.__proto__ = EventEmitter.prototype;
module.exports = NodeLogger;
