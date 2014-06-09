goog.provide('zeimyth.Board');

goog.require('goog.dom');
goog.require('zeimyth.util.scalar');

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

	var coord = this.randomCoord();

	while (this.grid[coord.x][coord.y].value) {
		coord = this.randomCoord();
	}

	this.grid[coord.x][coord.y] = this.randomValue();
};

/**
 * @return {{x: number, y: number}}
 *
 * @private
 */
zeimyth.Board.prototype.randomCoord = function() {
	var dimensions = zeimyth.game.getDimensions();

	var x = zeimyth.util.getRandom(dimensions.width);
	var y = zeimyth.util.getRandom(dimensions.height);

	return {x: x, y: y};
};

/**
 * @return {{className: string, value: number}}
 *
 * @private
 */
zeimyth.Board.prototype.randomValue = function() {
	var roll = zeimyth.util.getRandom(this.fourWeight);
	var two = {className: this.getClassName(2), value: 2};
	var four = {className: this.getClassName(4), value: 4};

	if (roll) {
		return two;
	}
	else {
		return four;
	}
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
		case zeimyth.Board.Directions['right']:
			if (zeimyth.util.scalar.forSome(dimensions.height, function(y) {
				for (var x = dimensions.width - 1; x > 0; x--) {
					if (!this.grid[x][y].value && this.grid[x-1][y].value) {
						return true;
					}
					else if (this.grid[x][y].value && this.grid[x][y].value == this.grid[x-1][y].value) {
						return true;
					}
				}

				return false;
			}, this)) {
				zeimyth.util.scalar.forEach(dimensions.height, function(y) {
					var x;
					for (x = dimensions.width - 2; x >= 0; x--) {
						if (!!this.grid[x][y].value) {
							var done = false;
							for (var dx = x + 1; dx < dimensions.width && !done; dx++) {
								if (!this.grid[dx][y].value) {
									this.grid[dx][y] = this.grid[x][y];
									this.grid[x][y] = {className: 'empty'};
									x++;
								}
								else if (this.grid[dx][y].value == this.grid[x][y].value && !this.grid[dx][y].locked) {
									this.combineTiles({x: dx, y: y}, {x: x, y: y});
									done = true;
								}
								else {
									done = true;
								}
							}
						}
					}
					for (x = 0; x < dimensions.width; x++) {
						this.grid[x][y].locked = false;
					}
				}, this);
				this.placeRandomTile();
			}
			break;
		case zeimyth.Board.Directions['up']:
			if (zeimyth.util.scalar.forSome(dimensions.width, function(x) {
				for (var y = 0; y < dimensions.height - 1; y++) {
					if (!this.grid[x][y].value && this.grid[x][y+1].value) {
						return true;
					}
					else if (this.grid[x][y].value && this.grid[x][y].value == this.grid[x][y+1].value) {
						return true;
					}
				}

				return false;
			}, this)) {
				zeimyth.util.scalar.forEach(dimensions.width, function(x) {
					var y;
					for (y = 1; y < dimensions.height; y++) {
						if (!!this.grid[x][y].value) {
							var done = false;
							for (var dy = y - 1; dy >= 0 && !done; dy--) {
								if (!this.grid[x][dy].value) {
									this.grid[x][dy] = this.grid[x][y];
									this.grid[x][y] = {className: 'empty'};
									y--;
								}
								else if (this.grid[x][dy].value == this.grid[x][y].value && !this.grid[x][dy].locked) {
									this.combineTiles({x: x, y: dy}, {x: x, y: y});
									done = true;
								}
								else {
									done = true;
								}
							}
						}
					}
					for (y = 0; y < dimensions.height; y++) {
						this.grid[x][y].locked = false;
					}
				}, this);
				this.placeRandomTile();
			}
			break;
		case zeimyth.Board.Directions['left']:
			if (zeimyth.util.scalar.forSome(dimensions.height, function(y) {
				for (var x = 0; x < dimensions.width - 1; x++) {
					if (!this.grid[x][y].value && this.grid[x+1][y].value) {
						return true;
					}
					else if (this.grid[x][y].value && this.grid[x][y].value == this.grid[x+1][y].value) {
						return true;
					}
				}

				return false;
			}, this)) {
				zeimyth.util.scalar.forEach(dimensions.height, function(y) {
					var x;
					for (x = 1; x < dimensions.width; x++) {
						if (!!this.grid[x][y].value) {
							var done = false;
							for (var dx = x - 1; dx >= 0 && !done; dx--) {
								if (!this.grid[dx][y].value) {
									this.grid[dx][y] = this.grid[x][y];
									this.grid[x][y] = {className: 'empty'};
									x--;
								}
								else if (this.grid[dx][y].value == this.grid[x][y].value && !this.grid[dx][y].locked) {
									this.combineTiles({x: dx, y: y}, {x: x, y: y});
									done = true;
								}
								else {
									done = true;
								}
							}
						}
					}
					for (x = 0; x < dimensions.width; x++) {
						this.grid[x][y].locked = false;
					}
				}, this);
				this.placeRandomTile();
			}
			break;
		case zeimyth.Board.Directions['down']:
			if (zeimyth.util.scalar.forSome(dimensions.width, function(x) {
				for (var y = dimensions.height - 1; y > 0; y--) {
					if (!this.grid[x][y].value && this.grid[x][y-1].value) {
						return true;
					}
					else if (this.grid[x][y].value && this.grid[x][y].value == this.grid[x][y-1].value) {
						return true;
					}
				}

				return false;
			}, this)) {
				zeimyth.util.scalar.forEach(dimensions.width, function(x) {
					var y;
					for (y = dimensions.height - 2; y >= 0; y--) {
						if (!!this.grid[x][y].value) {
							var done = false;
							for (var dy = y + 1; dy < dimensions.height && !done; dy++) {
								if (!this.grid[x][dy].value) {
									this.grid[x][dy] = this.grid[x][y];
									this.grid[x][y] = {className: 'empty'};
									y++;
								}
								else if (this.grid[x][dy].value == this.grid[x][y].value && !this.grid[x][dy].locked) {
									this.combineTiles({x: x, y: dy}, {x: x, y: y});
									done = true;
								}
								else {
									done = true;
								}
							}
						}
					}
					for (y = 0; y < dimensions.height; y++) {
						this.grid[x][y].locked = false;
					}
				}, this);
				this.placeRandomTile();
			}
			break;
	}
};

/**
 * @param  {{x: number, y: number}} tile1 The tile where the combination will stay
 * @param  {{x: number, y: number}} tile2 The tile that will disappear in the combination process
 */
zeimyth.Board.prototype.combineTiles = function(tile1, tile2) {
	var newValue = 2 * this.grid[tile1.x][tile1.y].value;

	this.grid[tile1.x][tile1.y] = {className: this.getClassName(newValue), value: newValue, locked: true};
	this.grid[tile2.x][tile2.y] = {className: 'empty'};
};

/**
 * Returns the CSS class name associated with the given number value.
 * 
 * @param  {number} value The value of the tile whose background you're looking up
 * @return {string} the class name for this tile
 *
 * @private
 */
zeimyth.Board.prototype.getClassName = function(value) {
	switch (value) {
		case 2: return 'two';
		case 4: return 'four';
		case 8: return 'eight';
		case 16: return 'sixteen';
		case 32: return 'thirty-two';
		case 64: return 'sixty-four';
		case 128: return 'one-hundred-twenty-eight';
		case 256: return 'two-hundred-fifty-six';
		case 512: return 'five-hundred-twelve';
		case 1024: return 'one-thousand-twenty-four';
		case 2048: return 'two-thousand-fourty-eight';
		default: return 'empty';
	}
};