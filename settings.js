//https://weblib.ccnl.scut.edu.cn/pages/c/vue/#cas //中央认证回跳地址
const version = '4.1.9';
var openbpupload=false;
var basePath = '';//加/这里会出现上传404     //2020.06.28
//'/pages/c/vue/' //打包接口前缀路径,包括上传的iframe要修改这里 2020-0628
//var basePath = '' //测试机接口前缀路径
var casUrl = 'https://ccnl.scut.edu.cn/cas/login?service='
  + encodeURIComponent('https://weblib.ccnl.scut.edu.cn/pages/casLogin.jsp')
var copyright = `© Copyright 2008-2019 DCampus Networks ltd. WebLib Plus V${version} 微服务`
//    var jwtUrl = 'http://localhost:9527/jwt'
var isJwtLogin = false;
//var serverurl='http://weblib.ccnl.scut.edu.cn'
var serverurl=''
//var serverurl='http://weblib.scutnc.cn'
// var uploadUrl = '/jwt'
//var uploadUrl = '/pages/c/vue/';//上传后的url
var uploadUrl = '/api' ;//yh本地测试路径
var fenleiid=0;
console.log('版本号：'+version)

