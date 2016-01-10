/* globals Modernizr */
"use strict";
var App = App || {};

// TO DO: add scrolling flag to stop multiple scrolls
// TO DO: create no flexbox fallback

App.Appslider = function(options) {

	this.slider = $(options.slider);									// Selector for slider
	this.slides = $(options.slides);									// Selector for individual slides
	this.sliderOffset = options.sliderOffset || 50; 					// Offset - this needs looking at, currently a bit arbitrary. 50 is centered
	this.slideWidth = options.slideWidth || 80;							// Requested width of slide based on viewport. Rename this to percentage
	this.slideCloneCount = options.slideCloneCount || 2;				// Number of slides to clone for endless scroll
	this.activeSlide = 0;												// Active slide reference
	this.slideDuration = options.slideDuration || 900;					// Duration of slide - should reflect css transition for .as-slider
	this.afterSlideUpdate = options.afterSlideUpdate || function() {};	// After slide update callback
	this.bulletNav = $(options.bulletNav);								// Selector for bullet nav container


	var _this = this,
		initFlag = false,
		viewport,
		allSlides,
		sliderWidth,
		slideWidth,
		sliderShift,
		scrollFlag = false;

	
	this.init = function() {

		initFlag = true;

		// Create the viewport
		this.slider.wrap('<div class="as-viewport">');
		viewport = this.slider.parent();

		// Add classes
		this.slider.addClass('as-slider');
		this.slides.addClass('as-slide');

		// Clone slides and add to slider	
		for(var i = 0; i < this.slideCloneCount; i++) {
			this.slides.eq(this.slides.length - (i + 1)).clone().prependTo(this.slider).addClass('as-slide-clone');
			this.slides.eq(i).clone().appendTo(this.slider).addClass('as-slide-clone');
		}

		// Cache slides & clones as selection. > selector ensures nested sliders aren't affected
		allSlides = this.slider.find('> .as-slide');

		// Update margin to account for cloned slide
		this.slider.css({
			marginLeft: -(this.slideWidth * this.slideCloneCount) + '%'
		});

		// Calculate % for slider & slide widths against viewport
		sliderWidth = this.slideWidth * allSlides.length;
		slideWidth = 100 / allSlides.length;

		this.slider.css({
			width: sliderWidth + '%'
		});

		allSlides.css({
			width: slideWidth + '%',
			flexBasis: slideWidth + '%'
		});

		// Offset the slider
		sliderShift = ((this.sliderOffset * 2) - this.slideWidth) / 2;

		this.slider.css({
			left: sliderShift + '%'
		});

		// Add data references to slides & clones
		allSlides.each(function(i) {
			jQuery(this).attr('data-as-slide', i - _this.slideCloneCount);
		});

		// Add active slide class
		this.slides.first().addClass('as-active-slide');

		// Add bullet active class
		if(this.bulletNav) {
			this.bulletNav.first().addClass('as-is-active');
		}

		this.userInteractions();

	};

	this.userInteractions = function() {

		// Click next slide scroll trigger
		allSlides.on('click.appslider', function() {
			_this.goToSlide(jQuery(this).data('as-slide'));
		});

		// Bullets trigger
		if(this.bulletNav) {
			this.bulletNav.on('click.appslider', function() {
				_this.goToSlide(jQuery(this).data('js-ref'));
				return false;
			});
		}
	};

	this.bulletHandler = function(ref) {
		
		// Update active bullet
		if(ref < 0) { ref = this.slides.length - 1; }
		if(ref > this.slides.length - 1) { ref = 0; }

		this.bulletNav.removeClass('as-is-active');
		this.bulletNav.filter('[data-js-ref="' + ref + '"]').addClass('as-is-active');
	};

	this.goToNextSlide = function() {
		this.goToSlide(this.activeSlide + 1);
	};

	this.goToPreviousSlide = function() {
		this.goToSlide(this.activeSlide - 1);
	};

	this.goToSlide = function(ref) {

		// Set scroll flag
		if(scrollFlag) {
			return;
		}

		scrollFlag = true;

		// Update bullet nav
		if(this.bulletNav) {
			this.bulletHandler(ref);
		}

		// Remove active slide class
		this.slides.removeClass('as-active-slide');

		// Make sure transition is enabled
		_this.slider.removeClass('as-no-transition');

		// Work out slide distance
		var posUpdate = -slideWidth * ref;

		// Update slider css
		if(!Modernizr.csstransforms3d) {
			this.slider.css({
				transform: 'translateX(' + posUpdate + '%)',
			});	
		} else {
			this.slider.css({
				transform: 'translate3d(' + posUpdate + '%, 0px, 0px)',
			});
		}

		// Update active slide reference
		this.activeSlide = ref;

		// If slide ref represents a cloned slide, reset slider position...
		
		// ...to the end
		if(ref < 0) {
			var resetUpdate = slideWidth * (this.slides.length - 1);

			setTimeout(function() {
				_this.slider.addClass('as-no-transition');
				if(!Modernizr.csstransforms3d) {
					_this.slider.css({
						transform: 'translateX(-' + resetUpdate + '%)'
					});
				} else {
					_this.slider.css({
						transform: 'translate3d(-' + resetUpdate + '%, 0px, 0px)'
					});
				}
			}, _this.slideDuration);

			// Update active slide reference
			this.activeSlide = this.slides.length - 1;

			// Add active slide class
			this.slides.last().addClass('as-active-slide');
		}

		// ...to the beginning
		else if(ref > this.slides.length - 1) {
			setTimeout(function() {
				_this.slider.addClass('as-no-transition');
				if(!Modernizr.csstransforms3d) {
					_this.slider.css({
						transform: 'translateX(0px)'
					});
				} else {
					_this.slider.css({
						transform: 'translate3d(0px, 0px, 0px)'
					});
				}
			}, _this.slideDuration);

			// Update active slide reference
			this.activeSlide = 0;

			// Add active slide class
			this.slides.first().addClass('as-active-slide');
		}

		else {
			// Add active slide class
			this.slides.filter('[data-as-slide="' + ref + '"]').addClass('as-active-slide');
		}

		setTimeout(function() {

			// Update scroll flag
			scrollFlag = false;

			// Call after slide update callback
			_this.afterSlideUpdate.call();
		}, _this.slideDuration);
	};

	this.destroy = function() {
		
		if(initFlag) {
			// Remove css
			this.slider.unwrap();
			this.slider.css({width: '', marginLeft: '', left: '', transform: ''});
			this.slides.css({width: ''});

			// Remove classes
			this.slides.removeClass('as-slide as-active-slide');
			this.slider.removeClass('as-slider');

			// Delete clones
			allSlides.filter('.as-slide-clone').remove();

			// Remove event listeners
			allSlides.off('click.appslider');
			this.bulletNav.off('click.appslider');
		}
	};
};