
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , url = require('url')
  , http = require('http')
  , path = require('path')
  , fs = require('fs')
  , server
  , port = 3000;


var app = express();

app.use(express.static('views/'));
app.listen(port);

