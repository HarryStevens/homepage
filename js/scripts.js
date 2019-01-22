$.getJSON("https://spreadsheets.google.com/feeds/list/1Na5JXRu_GIgpi8tC9WOSg6awbt3WKq9nLKptj64TLFQ/default/public/values?alt=json-in-script&callback=?", function(data){
	
	var columns = Object.keys(data.feed.entry[0]).filter(function(key){ return key.indexOf("gsx$") != -1; });
	var published = data.feed.entry.map(function(row, row_index){
		
		var obj = {};

		columns.forEach(function(column){

			obj[column.replace("gsx$", "")] = row[column].$t;

		});

		return obj;
		
	});

	d3.queue()
		.defer(d3.json, "data/blog.json")
		.defer(d3.json, "data/blocks.json")
		.await(ready);

	function ready(error, blog, blocks){

		var data = (published.concat(blog)).concat(blocks);

		// sort the blocks
		var blocks = _.chain(data).where({category: "Blocks"}).sortBy("block_number").value();
		var no_blocks = _.reject(data, {category: "Blocks"});
		data = no_blocks.concat(blocks);

		data.forEach(function(d){
			return d.cat_slug = jz.str.toSlugCase(d.category); 
		});

		var categories = ["Published", "Blog", "Blocks"];
		// categories.push("Blocks");
		categories.forEach(function(cat){

			// look up all the posts that match the category
			var w = _.where(data, {category: cat});

			// filter out certain items from the published list
			if (cat == "Published") w = w.filter(function(d){ return d.hide != "TRUE"; });

			var slug = w[0].cat_slug;

			$(".nav-links .links-sub-wrapper").append("<div class='nav-link-cat " + slug + "'><a href='#" + slug + "'>" + cat + "</a></div>");
			$(".body-wrapper").append("<div class='body-section " + slug + "' id='" + slug + "'><h3>" + cat + "</h3></div>")

			w.forEach(function(row, row_index){

				var pub_line = slug == "published" ?  row.publication + " | " : "";
				var url = slug === "blog" && row.internal ? "blog/" + row.slug : row.url;

				$(".body-section." + slug).append("<a href='" + url + "'><div class='article article-" + row_index + "'><div class='headline'>" + row.headline + "</div><div class='dateline'>" + pub_line + row.date + "</div></div></a>");

				if (slug == "published"){
					$(".body-section.published .article-" + row_index).prepend("<div style='background-image:url(" + row.img + ")' class='img-wrapper'></div>")
				}

				if (slug == "blocks"){
					
					$(".body-section.blocks .article-" + row_index).css({
						"background-image": "url(" + row.img + ")"
					})
				}
			});

		}); // end categories loop

	}

});

var text = $(".header h1 a").attr("href", "#").text();
$(".header h1").html(text);
