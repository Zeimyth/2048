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

/** @enum */
zeimyth.Board.Directions = {
	'right' : 0,
	'up' : 1,
	'left': 2,
	'down' : 3
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
			column.push({className: 'empty'});
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
	var me = this;

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
		var roll = zeimyth.util.getRandom(me.fourWeight);
		var two = {className: 'two', value: 2};
		var four = {className: 'four', value: 4};

		if (roll) {
			return two;
		}
		else {
			return four;
		}
	};

	var coord = randomCoord();

	while (this.grid[coord.x][coord.y].value) {
		coord = randomCoord();
	}

	this.grid[coord.x][coord.y] = randomValue();
};

/**
 * @private
 */
zeimyth.Board.prototype.render = function() {
	var outerDiv = this.domHelper.getElementByClass('gamegrid');
	this.domHelper.removeChildren(outerDiv);

	var dimensions = zeimyth.game.getDimensions();

	for (var y = 0; y < dimensions.height; y++) {
		var row = this.domHelper.createDom('div', 'row');

		var topBottomClass = '';
		if (y === 0) topBottomClass = ' top';
		if (y == dimensions.height - 1) topBottomClass = ' bottom';

		for (var x = 0; x < dimensions.width; x++) {
			var leftRightClass = '';
			if (x === 0) leftRightClass = ' left';
			if (x === dimensions.width - 1) leftRightClass = ' right';

			var tile = this.domHelper.createDom(
				'div',
				'tile ' + this.grid[x][y].className + topBottomClass + leftRightClass,
				this.grid[x][y].value ? this.domHelper.createTextNode(this.grid[x][y].value) : null
			);

			this.domHelper.appendChild(row, tile);
		}

		this.domHelper.appendChild(outerDiv, row);
	}
};

/**
 * @param {string} dir
 */
zeimyth.Board.prototype.handleDirection = function(dir) {
	this.shiftGrid(dir);
	this.render();
};

/**
 * @param {string} dir
 *
 * @private
 */
zeimyth.Board.prototype.shiftGrid = function(dir) {
	var dimensions = zeimyth.game.getDimensions();

	switch(zeimyth.Board.Directions[dir]) {
		case zeimyth.Board.Directions['up']:
			if (goog.array.some(this.grid, function(row) {
				for (var x = 0; x < dimensions.width - 1; x++) {
					if (!row[x].value && row[x+1].value) {
						return true;
					}
					else if (row[x].value && row[x].value == row[x+1].value) {
						return true;
					}
				}

				return false;
			})) {
				goog.array.forEach(this.grid, function(row) {
					for (var x = 1; x < dimensions.width; x++) {
						if (!!row[x].value) {
							var done = false;
							for (var dx = x - 1; dx >= 0 && !done; dx--) {
								if (!row[dx].value) {
									row[dx] = row[x];
									row[x] = {className: 'empty'};
									x--;
								}
								else if (row[dx].value == row[x].value && !row[dx].locked) {
									var newClassName = '';
									var newValue = 2 * row[x].value;

									if (row[x].value == '2') {
										newClassName = 'four';
									}
									else {
										newClassName = 'eight';
									}

									row[dx] = {className: newClassName, value: newValue, locked: true};
									row[x] = {className: 'empty'};
									done = true;
								}
								else {
									done = true;
								}
							}
						}
					}
					for (var x = 0; x < dimensions.width; x++) {
						row[x].locked = false;
					}
				});
				this.placeRandomTile();
			}
	}
};