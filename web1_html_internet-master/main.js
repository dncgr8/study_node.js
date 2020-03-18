var http = require('http');
const fs = require('fs');
const url = require('url');
var app = http.createServer(function(request,response){
    var _url = request.url;
    console.log(_url); //  /2.html?id=HTML
    var queryData = url.parse(_url,true).query;
    console.log(queryData); // { id: 'CSS' } <- Query String 정보가 넘어옴
    console.log(queryData.id); // CSS
    var title = queryData.id;
    if(_url == '/?id=Web'){
      title = 'Welcome';
      queryData.id = "WEB";
    }
    if(_url == '/favicon.ico'){
        response.writeHead(404);
        response.end();
        return;
    }
    response.writeHead(200);
    fs.readFile(`data/${queryData.id}` , 'utf8' , (err, description) => {
      if (err) throw err;
      var template = `
      <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/?id=Web">WEB</a></h1>
    <ol>
      <li><a href="/?id=HTML">HTML</a></li>
      <li><a href="/?id=CSS">CSS</a></li>
      <li><a href="/?id=JavaScript">JavaScript</a></li>
    </ol>
    <h2>${title}</h2>
    <p>${description}</p>
  </body>
  </html>
  
      `;
      response.end(template);
    })

 
});
app.listen(3000);