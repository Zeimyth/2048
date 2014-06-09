goog.provide('zeimyth.game');

goog.require('zeimyth.Board');
goog.require('zeimyth.events');

/**
 * @type {{width: number, height: number}}
 *
 * @private
 */
zeimyth.game.dimensions = { width: 4, height: 4 };

/** @private */
zeimyth.game.score = 0;

zeimyth.game.getDimensions = function() { return zeimyth.game.dimensions; };

zeimyth.game.getScore = function() { return zeimyth.game.score; };
zeimyth.game.incrementScore = function(amt) { zeimyth.game.score += amt; };

/** @private */
zeimyth.game.gameBoard = new zeimyth.Board();

zeimyth.game.getBoard = function() { return zeimyth.game.gameBoard; };

zeimyth.game.run = function() {
	zeimyth.game.gameBoard.render();
	zeimyth.events.initialize(zeimyth.game.gameBoard);
};
