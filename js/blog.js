$(document).ready(function(){

	// strip all attributes
	$(".blog-wrapper a, .blog-wrapper code, .blog-wrapper pre, .blog-wrapper div, .blog-wrapper p, .blog-wrapper h1, .blog-wrapper h3").removeAttr("class").removeAttr("id").removeAttr("name");

	// replace every instance of </pre><pre>
	var h = $(".blog-wrapper").html().replaceAll("</pre><pre>", "<br />");
	$(".blog-wrapper").html(h);

	$(".blog-wrapper pre").each(function(index, pre){
		var html = $(pre).html();
		$(this).addClass("language-javascript").html("<code class='language-javascript'>" + html + "</code>");
	});

	$("title").html("Harry Stevens | " + $(".blog-wrapper h1").text())
	
});

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};