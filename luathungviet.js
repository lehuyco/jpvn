#!/usr/bin/env node

/**
 * Module dependencies.
 */
global.__basedir = __dirname;
global.__host =
  process.env.NODE_ENV === "production"
    ? "https://luathungviet.vn"
    : "http://lvh.me:3114";
global.SENDGRID_API_KEY =
  "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";
global.FACEBOOK_APP_ID = "493500264578538";
global.FACEBOOK_APP_SECRET = "447020a901fb0c07827e67c25865a257";
global.FACEBOOK_CALLBACK_URL = __host + "/auth/facebook/callback";
global.GOOGLE_CALLBACK_URL = __host + "/auth/google/callback";
global.GOOGLE_CONSUMER_KEY =
  "510959978904-nmlg3shppct23g8ngo85jkplsqpo5o9j.apps.googleusercontent.com";
global.GOOGLE_CONSUMER_SECRET = "u_WKEIB6PRgTtkVfvIwqMt7X";

global.COMPANY_EMAIL = "lienhe@luathungviet.vn";

var app = require("./app");
var debug = require("debug")("lehuy:server");
var http = require("http");
var mongoose = require("mongoose");

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort("3114");
app.set("port", port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Database connect
 */
mongoose.connect("mongodb://localhost:27017/luathungviet", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", console.info.bind(console, "Database connected!"));

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
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
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}
