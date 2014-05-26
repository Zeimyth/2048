goog.provide('zeimyth.Board');

goog.require('goog.dom');

/**
 * @constructor
 */
zeimyth.Board = function() {
	var dimensions = zeimyth.game.getDimensions();

	this.domHelper = goog.dom.getDomHelper();

	// Stores the current values in the game grid. Stored in column-major form.
	this.grid = this.initializeGrid(dimensions);
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
	var outerDiv = this.domHelper.getElementByClass('gamegrid');

	var dimensions = zeimyth.game.getDimensions();

	for (var y = 0; y < dimensions.height; y++) {
		var row = this.domHelper.createDom('div', 'row');

		for (var x = 0; x < dimensions.width; x++) {
			var tile = this.domHelper.createDom('div', this.grid[x][y] ? 'tile two' : 'tile empty', this.grid[x][y] ? this.domHelper.createTextNode('2') : null);

			this.domHelper.appendChild(row, tile);
		}

		this.domHelper.appendChild(outerDiv, row);
	}
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