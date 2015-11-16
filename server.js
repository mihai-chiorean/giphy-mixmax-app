var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var cors = require('cors');
var morgan = require('morgan');


// Serve assets in /public.
app.use(express.static(__dirname + '/public'));

// log some requests
app.use(morgan('dev'));

// So we can POST.
app.use(bodyParser.urlencoded());

// Since Mixmax calls this API directly from the client-side, it must be whitelisted.
var corsOptions = {
  origin: /^[^.\s]+\.mixmax\.com$/,
  credentials: true
};

// The editor interface.
app.get('/editor', function(req, res) {
  res.sendFile(__dirname + '/editor.html');
});

app.get('/api/hub', cors(corsOptions), require('./api/hub'));

app.listen(process.env.PORT || 8910);
