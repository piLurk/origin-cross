// by wudongyue 2018-3-7
var app = require('express')()
var path = require('path')
var proxy = require('http-proxy-middleware')
var cookieParser = require('cookie-parser')
var serveStatic=require('serve-static');
const port = 80

var __dirname = path.resolve()
app.use(cookieParser())
//静态文件请求
app.use(serveStatic('public'))

//设置一个默认cookie
app.use('/',function(req, res, next){
	console.log(req.cookies)
	res.cookie('islogin', 'value-from-dongyuewu.me', { maxAge: 600000 })
	next()
})
app.use('/proxy', proxy({
	// 代理跨域目标接口
	target: 'http://a.dongyuewu.me',
	changeOrigin: true,

	// 修改响应头信息，实现跨域并允许带cookie
	onProxyRes: function(proxyRes, req, res) {
			res.header('Access-Control-Allow-Origin', 'http://dongyuewu.me');
			res.header('Access-Control-Allow-Credentials', 'true');
	},

	// 修改响应信息中的cookie域名
	cookieDomainRewrite: 'dongyuewu.me'  // 可以为false，表示不修改
}));

app.listen(port,function (req,res) {
	console.log("服务器正在"+port+"端口运行");
});