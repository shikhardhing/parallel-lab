var express = require('express');
var session = require('express-session');
var multer  = require('multer');
var http  = require('http');
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

var storage = multer.diskStorage(
    {
        destination: 'the_folder/',
        filename: function ( req, file, cb ) {
            console.log(file.originalname);
            cb( null, file.originalname);
        }
    }
);

var upload = multer( { storage: storage } );
const dirTree = require('directory-tree');

var app = express();

var sess = {
  secret: 'keyboard cat',
  cookie: {},
  resave: true,
  saveUninitialized: true
}

app.set('trust proxy', 1) // trust first proxy
sess.cookie.secure = true // serve secure cookies

io.on('connection', function(socket){
  console.log('a user connected');
});
app.use(session(sess))
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname));
var server = app.listen(app.get('port'), function () {
	var host = 'localhost'
	var port = server.address().port
	console.log("Example app listening at http://%s:%s", host, port)
});

//Home Page
app.get('/',function (req, res, next) {
	res.sendFile('viewer.html',  {root: __dirname });
});

//Send data as a tree structure
app.get('/data',function (req, res, next) {
	const tree = dirTree('the_folder');
	console.log(tree);
	res.send(tree);
	res.end();
});

//Download a file from the server
app.get('/download/*', function(req, res){
  console.log(req.params['0']);
  var file = __dirname + '/the_folder/' + req.params['0'];
  console.log(file);
  res.download(file); // Set disposition and send it.
});

//Modify the file on the server
app.post('/upload', upload.single('avatar'), function (req, res, next) {
    res.redirect('/');
})
