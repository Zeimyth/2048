goog.provide('zeimyth.game');

goog.require('zeimyth.Board');
goog.require('zeimyth.events');

(function gameClosure() {
	
	/** @type {{width: number, height: number}} */
	var dimensions = { width: 4, height: 4 }

	var gameBoard = new zeimyth.Board();

	zeimyth.game.getDimensions = function() { return dimensions; }
	zeimyth.game.getBoard = function() { return gameBoard; }

	zeimyth.game.run = function() {
		zeimyth.events.initialize(gameBoard);
	};

})();


