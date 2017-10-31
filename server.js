var express = require('express');
var session = require('express-session');
var multer  = require('multer');
var http  = require('http');
var io = require('socket.io')(http);

var storage = multer.diskStorage(
    {
        destination: 'the_folder/',
        filename: function ( req, file, cb ) {
            //req.body is empty...
            //How could I get the new_file_name property sent from client here?
            console.log(file.originalname);
            cb( null, file.originalname);
        }
    }
);

var upload = multer( { storage: storage } );
// var upload = multer({ dest: 'the_folder/' });
const dirTree = require('directory-tree');

var app = express();

var sess = {
  secret: 'keyboard cat',
  cookie: {}
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


app.get('/',function (req, res, next) {
	res.sendFile('viewer.html',  {root: __dirname });
});

app.get('/data',function (req, res, next) {
	const tree = dirTree('the_folder');
	console.log(tree);
	res.send(tree);
	res.end();
});

app.get('/download/:file', function(req, res){
  var file = __dirname + '/the_folder/' + req.params.file;
  console.log(file);
  res.download(file); // Set disposition and send it.
});

app.post('/upload', upload.single('avatar'), function (req, res, next) {
	res.redirect('/');
})