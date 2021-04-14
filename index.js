const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const fs = require("fs");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
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
hbs.handlebars.registerHelper('clipText', function(text) {
	text = text.slice(0, 150);
	text += text.length === 150 ? "..." : "";
	return text;
})
hbs.handlebars.registerHelper('firstSection', function(text) {
	text = text.replace(/^\n+/, "").split(/\n/)[0];
	return text;
})
hbs.handlebars.registerHelper('readingTime', function(text) {
  const readTime = require('reading-time');
	return readTime(text).text
})

app.set('view engine', 'hbs');

app.get('/', (req, res) => {
  res.render('index')
});

app.get("/meta.json", (req, res) => {
	res.status(200).json({author_name: "--Explosion--", author_url: `https://scratch.mit.edu/users/--Explosion--`, provider_name: "JS Tutorial Blog", provider_url: "https://blog.explosionscratc.repl.co"})
})
app.get("/post/:id", (req, res) => {
	try {
		var post = {};
		post.text = fs.readFileSync(`${__dirname}/posts/${req.params.id}.md`, "utf-8");
		post.title = post.text.match(/^\#(.+)$/m)[1];
		post.text = post.text.replace(/^\#.+$/m, "").replace(/^\n/, "");
		post.id = req.params.id;
		res.render("post", {post})
	} catch(e){
		res.render("error", {error: "Sorry! That post doesn't exist!"})
	}
})
app.get("/new", (req, res) => {
	res.render("new")
})
app.post("/new_post", (req, res) => {
	console.log(req.body);
	res.redirect("/")
})
app.listen(3000, () => {
  console.log('server started');
});