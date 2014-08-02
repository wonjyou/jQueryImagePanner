/*!
 * jQuery plugin for resizing images to fit the window
 * Automatically resizes an image to the window
 * Copyright (c) 2014 Won J. You
 * Version: 1.0.0 (July 31, 2014)
 * Free to use under the GPLv2 license.
 * http://www.gnu.org/licenses/gpl-2.0.html
 *
 */

;(function( $, window ) {

	var defaults = {
		 scaleType : "crop", //options - fill, proportional, crop
		 bindResize : true, //should we always resize the image with the window
		 centerImage: true, // should we center the image against the container
		 container: window, // the element to resize the image against
		 callback: function(){}
	};

	function ImageSizer(element, settings) {
		this.el = element;
		this.$el = $(element);
		this.settings = $.extend( {}, defaults, settings );
	
		this._init();
	}
	
	ImageSizer.prototype = {
	
		_ratio: 1,
		
		_init: function () {

			var self = this;
			
			this._origWidth = this.el.width,
			this._origHeight = this.el.height;
			
			this.sw = $(this.settings.container).width();
			this.sh = $(this.settings.container).height();
			
			this._scaleImage();
			
			if (this.settings.bindResize){
				$( window ).resize(function() {
					self.sw = $(self.settings.container).width();
					self.sh = $(self.settings.container).height();
					self._scaleImage();
				});
			}

		},		
		
		_scaleImage: function(){

			var element = this.el;
			
			var goalWidth, 
				goalHeight,
				ratio,
				tempRatio;
			
			element.removeAttribute( "width" );
			element.removeAttribute( "height" );
				
			element.style.height = element.style.width = "";			
				
			if (this._origWidth <= this._origHeight){
				ratio = this._origWidth/this._origHeight;
			}
			else{
				ratio = this._origHeight/this._origWidth;
			}
				
			if (this.settings.scaleType == "fill"){				
				goalWidth = this.sw;
				goalHeight = this.sh;
			}
			else{
				if (this._origWidth <= this._origHeight){
					goalHeight = this.sh;
					goalWidth = ratio*this.sh;
					
				}
				else{
					goalWidth = this.sw;
					goalHeight = ratio*goalWidth;
				}
				
				if (this.settings.scaleType == "proportional"){
					
					//Double check that the height doesn't exceed the height of the stage 
					if (goalHeight > this.sh){
						tempRatio = sh/goalHeight;
						goalHeight = this.sh;
						goalWidth = tempRatio*goalWidth;
					}
				}
				else if (this.settings.scaleType == "crop"){
					//Is the aspect ratio of the image greater than the browser?
					if (this._origWidth / this._origHeight > this.sw / this.sh) {
						var scale = this.sh / this._origHeight;
						goalWidth = this._origWidth * scale;
						goalHeight = this._origHeight * scale;
					}
					else {
						var scale = this.sw / this._origWidth;
						goalWidth = this._origWidth * scale;
						goalHeight = this._origHeight * scale;
					}
				}
				
				element.width = goalWidth;
				element.height = goalHeight;
		
				if (this.settings.centerImage){
					var goalX = Math.round((this.sw - goalWidth)/2);
					var goalY = Math.round((this.sh - goalHeight)/2);
				
					this.$el.css({"left": goalX+"px", "top": goalY+"px", "position": 'absolute'});
				}
		
				if (typeof this.settings.callback === 'function'){
					this.settings.callback();
				}
				
			}
		}
		
	};


	$.fn.fitToWindow = function(options) {

		var args = arguments;
		var pluginName = "plugin_fitToWindow";

		if (options === undefined || typeof options === 'object') {

			return this.each(function() {
				if (!$.data(this, pluginName)) {
					$.data(this, pluginName, new ImageSizer(this, options));
				}
			});
		} 
		else if (typeof options === 'string' && options[0] !== '_' ) {

			if (Array.prototype.slice.call(args, 1).length == 0) {

				var instance = $.data(this[0], pluginName);
				return instance[options].apply(instance, Array.prototype.slice.call(args, 1));
			} else {

				return this.each(function() {
					var instance = $.data(this, pluginName);
					if (instance instanceof ImageSizer && typeof instance[options] === 'function') {
						instance[options].apply(instance, Array.prototype.slice.call(args, 1));
					}
				});
			}
		}		
		
	};

})( jQuery, window );
