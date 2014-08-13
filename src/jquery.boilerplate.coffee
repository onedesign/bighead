# Note that when compiling with coffeescript, the plugin is wrapped in another
# anonymous function. We do not need to pass in undefined as well, since
# coffeescript uses (void 0) instead.
do ($ = jQuery, window, document) ->

	# window and document are passed through as local variable rather than global
	# as this (slightly) quickens the resolution process and can be more efficiently
	# minified (especially when both are regularly referenced in your plugin).

	# Create the defaults once
	pluginName = "bigHead"
	defaults =
		minHeight: 300
		maxHeight: 960
		maxWidth: 1000
		heightGap: 40

	# The actual plugin constructor
	class Plugin
		constructor: (@element, options) ->
			# jQuery has an extend method which merges the contents of two or
			# more objects, storing the result in the first object. The first object
			# is generally empty as we don't want to alter the default options for
			# future instances of the plugin
			@settings = $.extend {}, defaults, options
			@_defaults = defaults
			@init()

		init: ->
			# Place initialization logic here
			# You already have access to the DOM element and the options via the instance,
			# e.g., @element and @settings
			@window = $(window)
			@$el = $(@element)
			@windowHeight = @window.height() - @settings.heightGap

			@sizeHead(@windowHeight)

		sizeHead: (height) =>
			# Only resize if the window height is within the parameters
	    if @isWithinRange(height)
	      # Zero out the intrinsic ratio padding
	      @$el.css("padding-bottom", 0)
	      # Set the $el height to specified size
	      @$el.outerHeight(@windowHeight)

	      @setRatio()

		isWithinRange: (height) =>
			windowToHeightRatio = height / @window.width()

			#First, we make sure that the existing height isn't out of range
			return false unless @testHeight(height)

			#Then we make sure the height will be within range at the maximum window width
			heightAtMax = @settings.maxWidth * windowToHeightRatio
			console.log heightAtMax
			return false unless @testHeight(heightAtMax)

			#Final Result
			return true

		testHeight: (height) =>
			height > @settings.minHeight and height < @settings.maxHeight

		setRatio: =>
			#Ensures that on further resizes the header scales proportionally
			w = @$el.outerWidth()
			h = @$el.outerHeight()
			ratio = (h / w) * 100
			@$el.css({
				"padding-bottom" : "#{ratio}%"
				"height" : "auto"
			})

	# A really lightweight plugin wrapper around the constructor,
	# preventing against multiple instantiations
	$.fn[pluginName] = (options) ->
		@each ->
			unless $.data @, "plugin_#{pluginName}"
				$.data @, "plugin_#{pluginName}", new Plugin @, options
