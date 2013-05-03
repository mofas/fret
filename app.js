
/**
 * Module dependencies.
 */

var express = require('express')
  , port = 3000;


var app = express();

app.use(express.static('views/'));
app.listen(port);

