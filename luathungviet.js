#!/usr/bin/env node

/**
 * Module dependencies.
 */
global.__basedir = __dirname
require('./config/global')

const app = require('./app')
const http = require('http')
const mongoose = require('mongoose')

/**
 * Normalize a port into a number, string, or false.
 */

const normalizePort = (val) => {
    var port = parseInt(val, 10)

    if (isNaN(port)) {
        // named pipe
        return val
    }

    if (port >= 0) {
        // port number
        return port
    }

    return false
}

/**
 * Event listener for HTTP server "error" event.
 */

const onError = (error) => {
    if (error.syscall !== 'listen') {
        throw error
    }

    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges')
            process.exit(1)
            break
        case 'EADDRINUSE':
            console.error(bind + ' is already in use')
            process.exit(1)
            break
        default:
            throw error
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

const onListening = () => {
    var addr = server.address()
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
    console.log('Listening on ' + bind)
}

const startServer = async () => {
    try {
        /**
         * Database connect
         */
        await mongoose.connect('mongodb://localhost:27017/luathungviet', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        })
        console.log('Database connected')

        /**
         * Listen on provided port, on all network interfaces.
         */
        server.listen(port)
        server.on('error', onError)
        server.on('listening', onListening)
    } catch (err) {
        console.log(err)
    }
}

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort('3114')
app.set('port', port)

/**
 * Create HTTP server.
 */

var server = http.createServer(app)

startServer()
