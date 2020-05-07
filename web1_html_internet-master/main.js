var express = require('express');
var app = express();
var fs = require('fs');
var template = require('./lib/template.js');
var path = require('path');
var qs = require('querystring');
var sanitizeHtml = require('sanitize-html');
var bodyParser = require('body-parser');
var compression = require('compression');
// prepare using middleware 
app.use(bodyParser.urlencoded({ extended: false}));
app.use(compression());

// app.get('/', (req, res) => res.send('Hello World!'))
app.get('/', (request, response) => fs.readdir('./data', function (error, filelist) {
  var title = 'Welcome';
  var description = 'Hello, Node.js';
  var list = template.list(filelist);
  var html = template.HTML(title, list,
    `<h2>${title}</h2>${description}`,
    `<a href="/create">create</a>`
  );
  response.send(html);
}))

app.get('/page/:pageId', (request, response) =>
  fs.readdir('./data', function (error, filelist) {
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
      var title = request.params.pageId;
      var sanitizedTitle = sanitizeHtml(title);
      var sanitizeDescription = sanitizeHtml(description, {
        allowedTags: ['hi']
      });
      var list = template.list(filelist);
      var html = template.HTML(title, list,
        `<h2>${sanitizedTitle}</h2>${sanitizeDescription}`,
        `<a href="/create">create</a>  
                <a href="/update/${filteredId}">update</a>
                <form action="/delete_process" method="post">
                <input type="hidden" name="id" value="${sanitizedTitle}">
                <input type="submit" value="delete">
                </form>
                `);
      response.send(html);
    });

  }))
app.get('/create', (request, response) =>
  fs.readdir('./data', function (error, filelist) {
    var title = 'WEB - create';
    var list = template.list(filelist);
    var html = template.HTML(title, list, `
                <form action = "/create_process" method="post">
                  <p><input type="text" name="title" placeholder="title"></p>
                  <p>
                    <textarea name="description" placeholder="description"></textarea>
                  </p>
                  <p>
                    <input type="submit">
                  </p>
                </form>
             `, '');
    response.send(html);
  }));
app.post('/create_process', (request, response) => {

    let post = request.body;
    let title = post.title;
    let description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf8', (err) => {
      response.writeHead(302, { Location: `/page/${title}` });
      response.end();
    })
  })

app.get('/update/:pageId', (request, response) => {
  fs.readdir('./data', (error, filelist) => {
    let filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
      let title = request.params.pageId;
      let list = template.list(filelist);
      let html = template.HTML(title, list,
        `
              <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <p><input type="text" name="title" placeholder="title" value="${title}"></p>
              <p>
              <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
                <input type="submit">
              </p>
              </form>
            `,
        `<a href="/create">create</a>  <a href="/update/${title}">update</a>`);
      response.send(html);
    })
  })
})

app.post('/update_process', (request, response) => {
    let post = request.body;
    console.log(post);
    let id = post.id;
    let title = post.title;
    let description = post.description;
    fs.rename(`data/${id}`, `data/${title}`, (error) => {
      fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
        response.redirect(`/page/${title}`);
      })
    });
  });


app.post('/delete_process', (request, response) => {
    let post = request.body;
    console.log(post);
    let id = post.id;
    let filteredId = path.parse(id).base;
    fs.unlink(`data/${filteredId}`,  (error) => {
      response.redirect('/')
    })

  });
app.listen(3000, () =>
  console.log('Example app listening on port 3000!')
)
