var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//-----------------追加ここから
//socket.ioのインスタンス作成
var io = require('socket.io').listen(server);
//クライアントから接続があった時
io.sockets.on('connection',function(socket){
	//クライアントからmessageイベントが受信した時
	socket.on('message',function(data){
		//念のためdataの値が正しいかチェック
		if(data && typeof data.text === 'string'){
			//メッセージを投げたクライアント以外すべてのクライアントにメッセージを送信する。
			socket.broadcast.json.emit('message',{text:data.text});
		}
	});
});
//------------------追加ここまで
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
