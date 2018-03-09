// by wudongyue 18-3-7
var app = require('express')()
var qs = require('querystring')
var serveStatic=require('serve-static');
var cookieParser = require('cookie-parser')

var server = require('http').Server(app)
var io = require('socket.io').listen(server)


const port = 80
app.use(cookieParser())
//静态文件请求
app.use(serveStatic('public'))
// app.use(cookieParser)
//---------- jsonp请求
app.get('/api/jsonpTest', function(req, res) {
  var params = qs.parse(req.url.split('?')[1]);
  var fn = params.callback;
  var result = {
    name:'jsonp',
    type:'test'
  }
// jsonp返回设置
  res.writeHead(200, { 'Content-Type': 'text/javascript' });
  res.write(fn + '(' + JSON.stringify(result) + ')');

  res.end()
})
// 代理请求
app.get('/proxy', function(req, res) {
  var params = qs.parse(req.url.split('?')[1]);
  res.cookie('islogin', req.cookies.islogin, { maxAge: 600000 })
  res.cookie('proxy', 'value-from-a.dongyuewu.me', { maxAge: 600000 })
  res.json({
    name:params.name,
    server:'a.dongyuewu.me',
    coo:req.cookies
  })
})

// --------- 跨域webSocket请求
io.on('connection', function(socket) {
  socket.on('message', function(msg) {
    console.log('gg')
    socket.send('被服务端加工过的数据：'+ msg)
  })

  socket.on('disconnect', function(){
    console.log('连接断开了')
  })
})


app.listen(port);

