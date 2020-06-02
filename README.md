//仿照网易云音乐


# websocket
WebSocket 是一种网络通信协议(HTTP 协议有一个缺陷：通信只能由客户端发起)
WebSocket 最大特点就是，服务器可以主动向客户端推送信息，客户端也可以主动向服务器发送信息，是真正的双向平等对话，属于服务器推送技术的一种
## 特点：
（1）建立在 TCP 协议之上，服务器端的实现比较容易。
（2）与 HTTP 协议有着良好的兼容性。默认端口也是80和443，并且握手阶段采用 HTTP 协议，因此握手时不容易屏蔽，能通过各种 HTTP 代理服务器。
（3）数据格式比较轻量，性能开销小，通信高效。
（4）可以发送文本，也可以发送二进制数据。
（5）没有同源限制，客户端可以与任意服务器通信。
（6）协议标识符是ws（如果加密，则为wss），服务器网址就是 URL。

## 客户端使用
```js
//最简单的例子
var ws = new WebSocket("wss://echo.websocket.org");

ws.onopen = function(evt) { 
  console.log("Connection open ..."); 
  ws.send("Hello WebSockets!");
};

ws.onmessage = function(evt) {
  console.log( "Received Message: " + evt.data);
  ws.close();
};
//或者是这种写法
ws.addEventListener("message", function(event) {
  console.log( "Received Message: " + event.data);
  // 处理数据
});

ws.onclose = function(evt) {
  console.log("Connection closed.");
}; 
```
## 构造函数 WebSocket 的API
### webSocket.readyState 属性返回实例对象的当前状态，共有四种
+ CONNECTING：值为0，表示正在连接。
+ OPEN：值为1，表示连接成功，可以通信了。
+ CLOSING：值为2，表示连接正在关闭。
+ CLOSED：值为3，表示连接已经关闭，或者打开连接失败。
### webSocket.onopen 连接成功后的回调函数
### webSocket.onclose 连接关闭后的回调函数
### webSocket.onmessage 实例对象的onmessage属性，用于指定收到服务器数据后的回调函数
### webSocket.send 用于向服务器发送数据
### webSocket.onerror 报错时的回调函数

## 服务端 node 实现
µWebSockets
Socket.IO （这个我见过）
WebSocket-Node

