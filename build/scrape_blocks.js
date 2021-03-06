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

// empty json
var json = [];

var scrape_gist_limited = _.rateLimit(scrape_gist, 5000);

// find out how many gists there are
request("https://gist.github.com/harrystevens", function(error, response, body){

	var $ = cheerio.load(body);

	console.log("Data will output as data/blocks.json");

	var number = Math.ceil($("#gist-pjax-container > div > div > div.col-9.col-md-9.col-12 > div.pagehead.py-0.border-0.mt-md-0.mt-6.mr-md-0.mr-n3.ml-md-0.ml-n3 > nav > div.UnderlineNav-body > a.js-selected-navigation-item.selected.UnderlineNav-item > span").text() / 10);
	console.log("Total gist pages: " + number)

	for (var i = 1; i <= number; i++){

		scrape_gist_limited(i);
		
	}

});
	
function scrape_gist(n){

	request("https://gist.github.com/harrystevens?page=" + n, function(error, response, body){

		if (!error && response.statusCode == 200){

			var $ = cheerio.load(body);
			$(".gist-snippet").each(function(block_index, block){
				
				// make sure the gist is a block
				if ($(block).find("a:nth-of-type(2)").text() == ".block"){
				
					// an empty object for the block info
					var obj = {};

					obj.block_number = (n - 1) * 10 + (block_index + 1);

					obj.category = "Blocks";
					obj.headline = $(block).find("span.f6.text-gray").text().trim();
					obj.date = $(block).find("time-ago").text().trim();
					obj.publication = "bl.ocks.org";
					obj.slug = slugify(obj.headline);
					var url_end = $(block).find("a:nth-of-type(2)").attr("href");
					obj.url = "https://bl.ocks.org" + url_end;

          console.log("Got block number " + obj.block_number, obj.headline);

					request("https://gist.github.com/" + url_end, function(error, response, body){
						
						var $ = cheerio.load(body);
						obj.img = $("#file-thumbnail-png").find("img").attr("src");

						json.push(obj);

						fs.writeFileSync(__dirname + "/../data/blocks.json", JSON.stringify(json));

					});

					}

				
			});

		} else {
			console.log("Error getting the blocks");
			console.log(error);
		}

	});
}
	


function slugify(text){
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}