node-logger
==============

Simple logging module for NodeJS

Usage:
```javascript

var logger = new loggingModule({
	useConsole: true,							//
	useFile: true,								//
	filePath: 'FTPProxy-Logging(%DATE%).log', 	//string
	level: 'DEBUG'								//[EMERGENCY|ALERT|CRITICAL|ERROR|WARNING|NOTICE|INFO|DEBUG]
});

logger.log('INFO', 'some text');
output: [2013-2-20 11:26:52] INFO some text

logger.info('some text');
output: [2013-2-20 11:26:52] INFO some text
```