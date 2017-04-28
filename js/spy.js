$(document).ready(function(){
	var nl_top = $(".nav-links").offset().top;

	function spy(){
		var st = $(window).scrollTop();
		if (st >= nl_top){
			$(".nav-links").css({
				"position": "fixed",
				"top": "0",
				"background": "#fff",
				"width": "100%",
				"box-shadow": "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)"
			});

			var nl_m_bottom = +$(".nav-links").css("margin-bottom").split("px")[0];
			var nl_height = +$(".nav-links").height();
			var nl_padding = +$(".nav-links").css("padding-top").split("px")[0]

			$("body").css({
				"margin-top": nl_m_bottom + nl_height + (nl_padding * 2)
			});

			$(".header").css({
				"opacity": "0"
			});

		} else {

			$(".nav-links").css({
				"position": "static",
				"top": "auto",
				"background": "transparent",
				"width": "auto",
				"box-shadow": "none"
			});

			$("body").css({
				"margin-top": "0px"
			});

			$(".header").css({
				"opacity": "1"
			})

		}
	}
	spy();

	$(window).scroll(spy)



	// Add smooth scrolling to all links
	$("a").on('click', function(event) {

	  // Make sure this.hash has a value before overriding default behavior
	  if (this.hash !== "") {
	    // Prevent default anchor click behavior
	    event.preventDefault();

	    // Store hash
	    var hash = this.hash;

	    // Using jQuery's animate() method to add smooth page scroll
	    // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
	    $("html, body").animate({
	      scrollTop: $(hash).offset().top - 60
	    }, 800, function(){
	 
	      // Add hash (#) to URL when done scrolling (default click behavior)
	      window.location.hash = hash;
	    });
	  } // End if
	});
});