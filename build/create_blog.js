var fs = require("fs"),
	cheerio = require("cheerio"),
	request = require("request"),
	_ = require("underscore");

// underscore rateLimit function
_.rateLimit = function(func, rate, async) {
  var queue = [];
  var timeOutRef = false;
  var currentlyEmptyingQueue = false;
  
  var emptyQueue = function() {
    if (queue.length) {
      currentlyEmptyingQueue = true;
      _.delay(function() {
        if (async) {
          _.defer(function() { queue.shift().call(); });
        } else {
          queue.shift().call();
        }
        emptyQueue();
      }, rate);
    } else {
      currentlyEmptyingQueue = false;
    }
  };
  
  return function() {
    var args = _.map(arguments, function(e) { return e; }); // get arguments into an array
    queue.push( _.bind.apply(this, [func, this].concat(args)) ); // call apply so that we can pass in arguments as parameters as opposed to an array
    if (!currentlyEmptyingQueue) { emptyQueue(); }
  };
};

var blog_posts = getDirectories("blog");

// load the blog posts
var posts = JSON.parse(fs.readFileSync("data/blog.json", "utf-8")).filter(function(d){ return d.category == "Blog"; });

var head = fs.readFileSync("components/head.html", "utf-8");
var foot = fs.readFileSync("components/foot.html", "utf-8");
var bottom = fs.readFileSync("components/bottom.html", "utf-8");

var get_post_limited = _.rateLimit(get_post_html, 1000);

posts.forEach(get_post_limited);

function get_post_html(post){

	request(post.url, function(error, response, body){

		var $ = cheerio.load(body);
		var html = $(".section-inner.sectionLayout--insetColumn").html();

		if (blog_posts.indexOf(post.slug) == -1){
			fs.mkdirSync("blog/" + post.slug);
		}

		fs.writeFileSync("blog/" + post.slug + "/index.html", head + "<div class='blog-wrapper'><div>Last updated on " + post.date + " | <a href='" + post.url + "'><i style='color:#00ab6b' class='fa fa-medium' aria-hidden='true'></i> Originally published on Medium</a></div>" + html + "</div>" + foot + "<script src='https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js'></script><script src='../../lib/prism.js'></script><script src='../../js/blog.js'></script>" + bottom);

	});

}

// Get all directories in another directory
// Requires "fs"
function getDirectories(path) {
  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path + "/" + file).isDirectory();
  });
}