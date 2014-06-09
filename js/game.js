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

/** @private */
zeimyth.game.done = false;

/** @private */
zeimyth.game.won = false;

zeimyth.game.getDimensions = function() { return zeimyth.game.dimensions; };

zeimyth.game.getScore = function() { return zeimyth.game.score; };
zeimyth.game.incrementScore = function(amt) { zeimyth.game.score += amt; };

zeimyth.game.isOver = function() { return zeimyth.game.done; };
zeimyth.game.isWon = function() { return zeimyth.game.done && zeimyth.game.won; };
zeimyth.game.isLost = function() { return zeimyth.game.done && !zeimyth.game.won; };

zeimyth.game.setGameWon = function() {
	alert('Congradulations, you win! Refresh the page to play again.');

	zeimyth.game.done = true;
	zeimyth.game.won = true;
};

zeimyth.game.setGameLost = function() {
	alert('You lost. Refresh the page to try again.');

	zeimyth.game.done = true;
	zeimyth.game.won = false;
};

/** @private */
zeimyth.game.gameBoard = new zeimyth.Board();

zeimyth.game.getBoard = function() { return zeimyth.game.gameBoard; };

zeimyth.game.run = function() {
	zeimyth.game.gameBoard.render();
	zeimyth.events.initialize(zeimyth.game.gameBoard);
};
