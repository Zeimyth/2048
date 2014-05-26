goog.provide('zeimyth.Board');

goog.require('goog.dom');

/**
 * @constructor
 */
zeimyth.Board = function() {
	var dimensions = zeimyth.game.getDimensions();

	/** Reciprocal of chance of getting a 4 when a new tile is generated */
	this.fourWeight = 10;

	this.domHelper = goog.dom.getDomHelper();

	// Stores the current values in the game grid. Stored in column-major form.
	/*this.grid = */this.initializeGrid(dimensions);
};

/**
 * @param {{width: number, height: number}} dimensions
 *
 * @private
 */
zeimyth.Board.prototype.initializeGrid = function(dimensions) {
	this.grid = [];

	for (var x = 0; x < dimensions.width; x++) {
		var column = [];

		for (var y = 0; y < dimensions.height; y++) {
			column.push(0);
		}

		this.grid.push(column);
	}

	this.placeRandomTile();
	this.placeRandomTile();

	return this.grid;
};

/**
 * @private
 */
zeimyth.Board.prototype.placeRandomTile = function() {

	var dimensions = zeimyth.game.getDimensions();

	/**
	 * @return {{x: number, y: number}}
	 */
	var randomCoord = function() {
		var x = zeimyth.util.getRandom(dimensions.width);
		var y = zeimyth.util.getRandom(dimensions.height);

		return {x: x, y: y};
	};

	var randomValue = function() {
		var roll = zeimyth.util.getRandom(this.fourWeight);
		var two = 1;
		var four = 1;

		if (roll) {
			return two;
		}
		else {
			return four;
		}
	};

	var coord = randomCoord();

	while (this.grid[coord.x][coord.y]) {
		coord = randomCoord();
	}

	this.grid[coord.x][coord.y] = randomValue();
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