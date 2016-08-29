// set up ======================================================================
// get all the tools we need
var express = require('express');
var app = express();
var server = require('http').Server(app);
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var routes = require('./config/pollconfig.js');
var io = require('socket.io').listen(server);

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/database.js');



var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })


// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'ilovescotchscotchyscotchscotch'
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/uploads'));
// launch ======================================================================

io.sockets.on('connection', routes.vote);

server.listen(port);
console.log('The magic happens on port ' + port);
