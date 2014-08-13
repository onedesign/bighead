/*
 *  jQuery BigHead - v1.0.0
 *  A jQuery plugin for better big headers.
 *  https://github.com/onedesign/bighead
 *
 *  Made by Brian Hanson
 *  Under MIT License
 */
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function($, window, document) {
    var Plugin, defaults, pluginName;
    pluginName = "bigHead";
    defaults = {
      minHeight: 300,
      maxHeight: 550,
      maxWidth: 1000,
      heightGap: 40
    };
    Plugin = (function() {
      function Plugin(element, options) {
        this.element = element;
        this.setRatio = __bind(this.setRatio, this);
        this.testHeight = __bind(this.testHeight, this);
        this.isWithinRange = __bind(this.isWithinRange, this);
        this.sizeHead = __bind(this.sizeHead, this);
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this.init();
      }

      Plugin.prototype.init = function() {
        this.window = $(window);
        this.$el = $(this.element);
        this.windowHeight = this.window.height() - this.settings.heightGap;
        return this.sizeHead(this.windowHeight);
      };

      Plugin.prototype.sizeHead = function(height) {
        if (this.isWithinRange(height)) {
          this.$el.css("padding-bottom", 0);
          this.$el.outerHeight(this.windowHeight);
          return this.setRatio();
        }
      };

      Plugin.prototype.isWithinRange = function(height) {
        var heightAtMax, windowToHeightRatio;
        windowToHeightRatio = height / this.window.width();
        if (!this.testHeight(height)) {
          return false;
        }
        heightAtMax = this.settings.maxWidth * windowToHeightRatio;
        if (!this.testHeight(heightAtMax)) {
          return false;
        }
        return true;
      };

      Plugin.prototype.testHeight = function(height) {
        return height > this.settings.minHeight && height < this.settings.maxHeight;
      };

      Plugin.prototype.setRatio = function() {
        var h, ratio, w;
        w = this.$el.outerWidth();
        h = this.$el.outerHeight();
        ratio = (h / w) * 100;
        return this.$el.css({
          "padding-bottom": "" + ratio + "%",
          "height": "auto"
        });
      };

      return Plugin;

    })();
    return $.fn[pluginName] = function(options) {
      return this.each(function() {
        if (!$.data(this, "plugin_" + pluginName)) {
          return $.data(this, "plugin_" + pluginName, new Plugin(this, options));
        }
      });
    };
  })(jQuery, window, document);

}).call(this);
