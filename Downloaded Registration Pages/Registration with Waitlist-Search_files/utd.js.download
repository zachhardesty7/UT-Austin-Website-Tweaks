// get jQuery object and release $
$utd = jQuery.noConflict(); 

// the document is ready, so we start the javascript app
$utd(document).ready(function() {
  
  // call the utd function
  if (utd && utd.start) {
    utd.start();
  }
});

// define UTD name space and page-agnostic functions
var utd = {
  start: function() {
    // the things that should happen every time the page
    // loads go here
    
    // if they will only need to be run once at the very 
    // beginning, just toss them right in, i.e.:
    // $utd('a').bind(...

	$utd("#search_link").click(function(){
		$utd("#search_display").slideToggle();
		$utd('input:text').hint();
	});
	
  }

    // if there is an action that needs to run on page load
    // but also needs to be called again and again,
    // define it as a function:
    
    // sampleFunction: function () {
    //  $utd('a').bind(...
    // }
    
    // then just call this function in your start function

};