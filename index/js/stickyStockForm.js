   $(document).ready(function(){
	   $(window).bind('scroll', function() {

	   var navHeight = $( window ).height() - 56;
			 if ($(window).scrollTop() >= navHeight) {
				 $('#stockForm').addClass('fixed');
			 }
			 else {
				 $('#stockForm').removeClass('fixed');
			 }
		});
	});
