#!/usr/bin/env node

/**
 * Module dependencies.
 */
import {app} from '../app';
import http from 'http';
import debug from 'debug';

debug('software-delivery-dashboard:server');

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 * @param {Object} val value to be normalized
 * @return {Object|boolean} calculated port number or boolean
 */
function normalizePort(val: any) {
  const thisPort = parseInt(val, 10);

  if (isNaN(thisPort)) {
    // named pipe
    return val;
  }

  if (thisPort >= 0) {
    // port number
    return thisPort;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 * @param {Object} error error to be handled
 */
function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const address = server.address();
  const bind =
        typeof address === 'string' ?
            'pipe ' + address :
            'port ' + address.port;
  debug('Listening on ' + bind);
}
