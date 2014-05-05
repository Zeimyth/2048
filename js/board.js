goog.provide('zeimyth.Board');

/**
 * @constructor
 */
zeimyth.Board = function() {

};

zeimyth.Board.left = 0;
zeimyth.Board.up = 1;
zeimyth.Board.right = 2;
zeimyth.Board.down = 3;

/**
 * @param {number} dir
 */
zeimyth.Board.prototype.handleDirection = function(dir) {
	alert('Dir ' + dir + ' pressed!');
};