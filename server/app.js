
/**
 * Module dependencies.
 */

var express = require('express'),
    mongoose = require('mongoose'),
    routes = require('./routes'),
    user = require('./routes/user'),
    text = require('./routes/text'),
    http = require('http'),
    path = require('path');

mongoose.connect('mongodb://localhost/happyminions');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler({
    dumpExceoptions: true,
    showStack: true
  }));
}

app.get('/', routes.index);
app.get('/users', user.list);
app.post('/text', text.create);
app.get('/happytexts', text.happyTexts);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
