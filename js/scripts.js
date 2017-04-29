$.getJSON("post_list.json", function(data){

	// sort the blocks
	var blocks = _.chain(data).where({category: "Blocks"}).sortBy("block_number").value();
	var no_blocks = _.reject(data, {category: "Blocks"});
	data = no_blocks.concat(blocks);

	data.forEach(function(d){
		return d.cat_slug = slugify(d.category); 
	});

	var categories = ["Published", "Blog", "Blocks"];
	// categories.push("Blocks");
	categories.forEach(function(cat){

		var w = _.where(data, {category: cat});
		var slug = w[0].cat_slug;

		$(".nav-links .links-sub-wrapper").append("<div class='nav-link-cat " + slug + "'><a href='#" + slug + "'>" + cat + "</a></div>");
		$(".body-wrapper").append("<div class='body-section " + slug + "' id='" + slug + "'><h3>" + cat + "</h3></div>")

		w.forEach(function(row, row_index){

			var pub_line = slug == "published" ?  row.publication + " | " : "";
			var url = slug == "blog" ? "blog/" + row.slug : row.url;

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

	});



});

var text = $(".header h1 a").attr("href", "#").text();
$(".header h1").html(text);



function slugify(text){
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}