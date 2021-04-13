const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const fs = require("fs");

app.use(express.static('public'))
app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
}));

var hbs = exphbs.create({});

hbs.handlebars.registerHelper('markdown', function(markdown) {
  var showdown  = require('showdown');
  var converter = new showdown.Converter();
	return converter.makeHtml(markdown);
})

hbs.handlebars.registerHelper('readingTime', function(text) {
  const readTime = require('reading-time');
	return readTime(text).text
})

app.set('view engine', 'hbs');

app.get('/', (req, res) => {
  res.render('index')
});

app.get("/post/:id", (req, res) => {
	var post = {};
	post.text = fs.readFileSync(`${__dirname}/posts/${req.params.id}.md`, "utf-8");
	post.title = post.text.match(/^\#(.+)$/m)[1];
	post.text = post.text.replace(/^\#.+$/m, "").replace(/^\n/, "")
	console.log(post)
	res.render("post", {post})
})
app.listen(3000, () => {
  console.log('server started');
});