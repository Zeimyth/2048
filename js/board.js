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
					for (var y = 1; y < dimensions.height; y++) {
						if (!!this.grid[x][y].value) {
							var done = false;
							for (var dy = y - 1; dy >= 0 && !done; dy--) {
								if (!this.grid[x][dy].value) {
									this.grid[x][dy] = this.grid[x][y];
									this.grid[x][y] = {className: 'empty'};
									y--;
								}
								else if (this.grid[x][dy].value == this.grid[x][y].value && !this.grid[x][dy].locked) {
									var newClassName = '';
									var newValue = 2 * this.grid[x][y].value;

									if (this.grid[x][y].value == '2') {
										newClassName = 'four';
									}
									else {
										newClassName = 'eight';
									}

									this.grid[x][dy] = {className: newClassName, value: newValue, locked: true};
									this.grid[x][y] = {className: 'empty'};
									done = true;
								}
								else {
									done = true;
								}
							}
						}
					}
					for (var y = 0; y < dimensions.height; y++) {
						this.grid[x][y].locked = false;
					}
				}, this);
				this.placeRandomTile();
			}
	}
};