"use strict";
var App = App || {};

// TO DO: check element scope works properly

App.Shareselected = function(options) {

	var _this = this;

	var shareBtns = $('<ul class="hs-list"><li><a target="_blank" href="#" data-share="twitter"></a></li><li><a href="#" data-share="email"></a></li></ul>'),
		twBtn = shareBtns.find('[data-share="twitter"]'),
		emailBtn = shareBtns.find('[data-share="email"]'),
		contentRef = $(options.contentRef) || $('body'), // Selector that allows highlighting e.g. <p> tags
		scopeParent = options.scopeParent || 'html',	 // Scope within which highlighting is allowed e.g. only <p> tags inside <div.container>
		btnPosTop = 0;


	this.init = function() {

		/* Share button setup */
		shareBtns.prependTo('body');

		this.userInteractions();

	};

	this.userInteractions = function() {

		/* Trigger functions with mouse up event */
		$(document).on('mouseup.shareselected', function(e) {
			setTimeout(_this.runShareHighlight, 100);
		});

	};

	this.runShareHighlight = function() {

		/* Only display if words are selected and correct element scope */
		if(_this.getSelectionText().length > 2 && _this.testScope()) {

			/* Get the text */
			var fullText = encodeURIComponent(_this.getSelectionText());
			var shareText = _this.getSelectionText().substring(0, 114) + "...";
			var url = encodeURIComponent(window.location.href);

			/* Position buttons */
			var btnPosition = _this.setBtnPosition();

			shareBtns.css({
				top: btnPosition.topPos + 'px',
				left: btnPosition.leftPos + 'px'
			}).addClass('hs-is-visible');

			/* Set the share links */
			twBtn.attr('href', 'http://twitter.com/intent/tweet?text=' + shareText + '&url=' + url);
			emailBtn.attr('href', 'mailto:?body=' + fullText + ' ' + url);

		} else {
			/* Hide share buttons */
			shareBtns.removeClass('hs-is-visible');
		}
	};

	this.getSelectionText = function() {

		var textContent = '';

		if (window.getSelection) {
			textContent = window.getSelection().toString();
		} else if (document.selection && document.selection.type !== 'Control') {
			textContent = document.selection.createRange().text;
		}

		return textContent;
	};

	this.testScope = function() {

		var selection = window.getSelection();
		var charParent = $(selection.anchorNode.parentNode);

		return charParent.parents(scopeParent).length > 0;

	};

	this.setBtnPosition = function() {

		var btnPosition = {};

		var selection = window.getSelection();
		var range = selection.getRangeAt(0); 
	    var rangeData = range.getBoundingClientRect();
	    
	    // Chrome handles boundingClientRect differently when multiple paragraphs selected
	    // This gets a better reference for bottom of selected text
	    var clientRects = range.getClientRects();
	    var lastRectBottom = clientRects[clientRects.length - 1].bottom;
	    
	    // This fixes another Chrome issue where selection ending on a paragraph break confuses bounding rectangle calc
	    if(range.endOffset === 0) {
	    	lastRectBottom = clientRects[clientRects.length - 2].bottom;
	    }

	    btnPosition.topPos = $(window).scrollTop() + lastRectBottom + 5;
	    btnPosition.leftPos = rangeData.left;

	    return btnPosition;

	};

};