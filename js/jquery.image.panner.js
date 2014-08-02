/*!
 * jQuery Panning plugin for images
 * based on code from manos.malihu.gr
 * Copyright (c) 2014 Won J. You
 * Version: 1.0 (July 30, 2014)
 * Free to use under the GPLv2 license.
 * http://www.gnu.org/licenses/gpl-2.0.html
 *
 */

;(function ($, window, document) {

	var defaults = {
	  	    animSpeed : 500, //ease speed in milliseconds
			easeType : "easeOutCirc",
			useAnimation: true
		};

	function ImagePanner(element, settings) {

		this.el = element;
		this.$el = $(element);
		this.settings = $.extend( {}, defaults, settings );

		this.$container = this.$el.find(".container");
		this.$img = this.$el.find(".container img");
		
		this._init();
	}
	
	ImagePanner.prototype = {
			
		_init: function () {

			var settings = this.settings;
			var self = this;			

			this.$img.css("margin-left", (this.$el.width() - this.$img.width())/2 + "px");
			this.$img.css("margin-top", (this.$el.height() - this.$img.height())/2 + "px");
			
			this.containerWidth = this.$el.width();
			this.containerHeight = this.$el.height();
			
			this.contentWidth = this.$img.width();
			this.contentHeight = this.$img.height();
			
			this.$container.css("width", this.contentWidth).css("height", this.contentHeight);
			
			this.start();
			
		},
		
		start: function(){
			var self = this;
			
			this.$el.mousemove(function( event ) {
				self._panTracker(event);
			});
		
		},
		
		stop: function(){
			this.$el.unbind('mousemove');
		},
		
		_moveImage: function (goalX, goalY){
			if (this.settings.useAnimation){			
				this.$container.stop().animate({left: goalX, top:goalY }, this.settings.animSpeed, this.settings.easeType);
			}
			else{
				this.$img.css({"left": goalX + "px", "top": goalY + "px"});
			}
		
		},
		
		_panTracker: function (e){
		
			var leftOffset = 0;
			var topOffset = 0;
			
			if (this.el != window){
				leftOffset = this.$el.offset().left;
				topOffset = this.$el.offset().top;
			}
			
			var mouseX = (e.pageX - leftOffset);
			var mouseY = (e.pageY - topOffset);
			var mousePercentX = mouseX / this.containerWidth;
			var mousePercentY = mouseY / this.containerHeight;
			
			var destX = -((this.contentWidth - (this.containerWidth * 2)) * mousePercentX);
			var destY = -((this.contentHeight - (this.containerHeight * 2)) * mousePercentY);
			
			var leftPos = mouseX - destX;
			var rightPos = destX - mouseX;
			var topPos = mouseY - destY;
			var bottomPos = destY - mouseY;
			
			var marginLeft = this.$img.css("marginLeft").replace("px", "");
			var marginTop = this.$img.css("marginTop").replace("px", "");
			
			var animSpeed = 500; //ease amount
			var easeType = "easeOutCirc";
			
			var goalX, goalY;
			
			if (mouseX > destX || mouseY > destY){
				goalX = -leftPos - marginLeft;
				goalY = -topPos - marginTop;
				
				this._moveImage(goalX, goalY);
			} 
			else if (mouseX < destX || mouseY < destY){
				goalX = rightPos - marginLeft;
				goalY = bottomPos - marginTop;
				
				this._moveImage(goalX, goalY);
			} 
			else {
				this.$container.stop(true, true);
			}
		}
	};

	$.fn.imagePanner = function(options) {
		var args = arguments;
		var pluginName = "plugin_imagePanner";

		if (options === undefined || typeof options === 'object') {

			return this.each(function() {
				if (!$.data(this, pluginName)) {
					$.data(this, pluginName, new ImagePanner(this, options));
				}
			});
		} else if (typeof options === 'string' && options[0] !== '_' ) {

			if (Array.prototype.slice.call(args, 1).length == 0) {

				var instance = $.data(this[0], pluginName);
				return instance[options].apply(instance, Array.prototype.slice.call(args, 1));
			} else {

				return this.each(function() {
					var instance = $.data(this, pluginName);
					if (instance instanceof ImagePanner && typeof instance[options] === 'function') {
						instance[options].apply(instance, Array.prototype.slice.call(args, 1));
					}
				});
			}
		}

	}
	
})( jQuery, window, document );