# jsp
本地JSP语言开发调试服务器，简单粗暴。
使用百度FIS中的jar包提供java服务支持，
如果小伙伴们仅仅需要一个简单粗暴的JSP语言开发服务器，
不需要FIS其它的强大功能，那么可以考虑使用这个。

##使用方法：
下载后npm install 安装依赖模块, 
然后在server.js中配置JSP文件路径(绝对路径)及端口号，如下：

```js

var opt = {
    'port': '8090',
    'root': 'D:/node-jsp-server/jsp/test',
    'process': 'java',
    'timeout': 3000
};
```
##help
```  
 $ node server --help

   Usage: server [options]

   Options:
     -h, --help           output usage information
     -V, --version        output the version number
     -start, --start      start server
     -stop, --start       stop server
     -restart, --restart  restart server

```

```

在server所在路径下打开命令行窗口，
输入"node server start" 启动服务，
    "node server stop" 停止服务,
    "node server restart" 重启服务。

```
test目录下有测试代码。

