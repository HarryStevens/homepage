var fs = require("fs"),
	cheerio = require("cheerio"),
	request = require("request"),
	moment = require("moment");

var json = [];

request("https://medium.com/@harry_stevens/", function(error, response, body){

	if (!error && response.statusCode == 200){

		var $ = cheerio.load(body);

		$(".streamItem--postPreview").each(function(post_index, post){

			var obj = {};
			obj.category = "Blog";
			obj.headline = $(post).find("h3.graf.graf--h3.graf--leading.graf--title").text();
			obj.date = moment($(post).find(".postMetaInline-authorLockup a time").attr("datetime")).format("D MMMM, YYYY");
			obj.publication = "Medium";
			obj.slug = slugify(obj.headline);
			obj.url = $(post).find(".postArticle-content.js-postField").parent().attr("href").split("?")[0];

			if (obj.headline != "About IndieData") {
				json.push(obj);
				console.log(obj.headline);
				fs.writeFileSync("data/blog.json", JSON.stringify(json));
			}

		});

	}

});

function slugify(text){
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}