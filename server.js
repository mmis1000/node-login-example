//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');

var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);
var bodyParser = require("body-parser");
router.use(express.static(path.resolve(__dirname, 'client')));

router.set('view engine', 'ejs');
router.set('views', 'views');

function genuuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}
router.use(cookieParser());
router.use(session({
  genid: function(req) {
    return genuuid(); // use UUIDs for session IDs
  },
  secret: 'keyboard cat'
}));

router.use(bodyParser.urlencoded());


router.get('/login', function(req, res, next){
  var sess = req.session;
  var lastError = sess.lastError;
  delete sess.lastError;
  res.render('login', {lastError : lastError});
});

router.post('/login', function(req, res, next){
  console.log(req.body);
  var sess = req.session;
  if(req.body.account == "12345" &&
    req.body.password == "12345") {
    sess.login = true;
    sess.user = req.body.account;
    res.redirect(302, '/user');
  } else {
    sess.lastError = "Wrong password or unexisted account!"
    res.redirect(302, '/login');
  } 
});

router.get('/user', function(req, res, next){
  res.render('user', {login : req.session.login, user : req.session.user, id :  req.sessionID});
});

router.get('/logout', function(req, res, next){
  req.session.destroy();
  res.redirect(302, '/login');
});


server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("server listening at", addr.address + ":" + addr.port);
});
