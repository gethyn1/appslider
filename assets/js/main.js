"use strict";
var App = App || {};

$(document).ready(function() {

	console.log('jQuery is loaded');

	// Initialise share highlighter
    var appSlider = new App.Appslider({
    	slider: 'div.appslider',
    	slides: 'div.slide'
    });
    
    appSlider.init();

    $('[data-js="prev"]').on('click', function() {
    	appSlider.goToPreviousSlide();
    	return false;
    });

    $('[data-js="next"]').on('click', function() {
    	appSlider.goToNextSlide();
    	return false;
    });
	
});