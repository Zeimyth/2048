goog.provide('zeimyth.Board');

/**
 * @constructor
 */
zeimyth.Board = function() {
	var dimensions = zeimyth.game.getDimensions();

	// Stores the current values in the game grid. Stored in column-major form.
	this.grid = this.initializeGrid(dimensions);

	this.render();
};

/**
 * @param {{width: number, height: number}} dimensions
 *
 * @private
 */
zeimyth.Board.prototype.initializeGrid = function(dimensions) {
	var grid = [];

	for (var x = 0; x < dimensions.width; x++) {
		var column = [];

		for (var y = 0; y < dimensions.height; y++) {
			column.push(0);
		}

		grid.push(column);
	}

	return grid;
};

/**
 * @private
 */
zeimyth.Board.prototype.render = function() {

};

zeimyth.Board.left = 0;
zeimyth.Board.up = 1;
zeimyth.Board.right = 2;
zeimyth.Board.down = 3;

/**
 * @param {number} dir
 */
zeimyth.Board.prototype.handleDirection = function(dir) {
	this.shiftGrid(dir);
	this.render();
};

/**
 * @param {number} dir
 *
 * @private
 */
zeimyth.Board.prototype.shiftGrid = function(dir) {
	alert('Dir ' + dir + ' pressed!');
};