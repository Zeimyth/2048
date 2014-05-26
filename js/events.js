goog.provide('zeimyth.events');

goog.require('zeimyth.Board');

(function eventsClosure() {

	/**
	 * @param {zeimyth.Board} board
	 */
	var initDirectionEvents = function(board) {
		document.onkeydown = function(e) {
			e = e || window.event;
			switch(e.which || e.keyCode) {
				case 37: // left
					board.handleDirection('left');
					break;
				case 38: // up
					board.handleDirection('up');
					break;
				case 39: // right
					board.handleDirection('right');
					break;
				case 40: // down
					board.handleDirection('down');
					break;
				default:
					return; // exit this handler for other keys
			}

			e.preventDefault();
		};
	};

	/**
	 * @param {zeimyth.Board} board
	 */
	zeimyth.events.initialize = function(board) {
		initDirectionEvents(board);
	};

})();
