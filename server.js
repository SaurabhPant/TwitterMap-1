
/**
* Module dependencies.
*/

var express = require('express')
  , routes = require('./routes')
  , nconf = require('nconf')
  , twit = require('twit');

var app = module.exports = express.createServer();

// import twitter keys
nconf.argv().env().file('keys.json');

// Configuration

app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

app.listen(process.env.PORT || 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);


var io = require('socket.io').listen(app);

io.configure(function () {
    io.set("transports", ["xhr-polling"]);
});

console.log('getting my twitters on');

//console.log(nconf.get('twitter_consumer_key'));
//console.log(nconf.get('twitter_consumer_secret'));
//console.log(nconf.get('twitter_access_token'));
//console.log(nconf.get('twitter_access_token_secret'));

var t = new twit({
    consumer_key: 'qTaLJJ9lQwfKbeLP0qT4VA',
    consumer_secret: 'iN6ps9NKOlKAXRQ3DS56zKnqkAxI8hde5rfVrpU',
    access_token: '15678105-T2NLXrSkPAYvcY9z1EbBktaJQk7TsQTCgtTa3RMNg',
    access_token_secret: 'Bc0lG5OkyJ6DZlvFoqbO3VyLreofu2DRtcf6dcXH8'
});




























console.log('start the stream');
//'-180,-90,180,90'
//'140,-200,140,-200'
//'-3.6,40,-3.6,40' 
t.stream('statuses/filter', { 'locations': '-180,-90,180,90' })
    .on('tweet', function (tweet) {
        if (tweet.coordinates != null) {
            io.sockets.emit('tweet', tweet);
        }
    }).on('limit', function (data) {
        console.log(data);
    });

