/*
 * @Author: your name
 * @Date: 2021-11-04 15:35:32
 * @LastEditTime: 2021-11-04 16:28:53
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /studentA/node路由/index.js
 */
const http = require('http');
const host = 'localhost';
const port = '8888';
const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  if(req.method === 'GET') {
    if(req.url === '/api/list') {
      res.end('查询列表接口响应');
    }else {
      res.end('GET请求响应');
    }
  }else if(req.method === 'POST') {
    if(req.url === '/api/register') {
      res.end('注册接口响应');
    }else if(req.url === '/api/login') {
      res.end('登录接口响应');
    }else {
      res.end('POST请求响应');
    }
  }
});
server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});