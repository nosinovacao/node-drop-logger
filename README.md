node-logger
==============

Simple logging module for NodeJS with colored message level

DEBUG: white

EMERGENCY|CRITICAL|ERROR: red

WARNING: yellow

NOTICE|INFO: cyan

OTHERS: green

Usage:
```javascript

var logger = new loggingModule({
	useConsole: true,							// boolean: true|false
	useFile: true,								// boolean: true|false
	filePath: 'FTPProxy-Logging(%DATE%).log', 	// string
	level: 'DEBUG'								// [EMERGENCY|ALERT|CRITICAL|ERROR|WARNING|NOTICE|INFO|DEBUG]
});

logger.log('INFO', 'some text');
output: [2013-2-20 11:26:52] INFO some text

logger.info('some text');
output: [2013-2-20 11:26:52] INFO some text
```