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
					board.handleDirection(zeimyth.Board.left);
					break;
				case 38: // up
					board.handleDirection(zeimyth.Board.up);
					break;
				case 39: // right
					board.handleDirection(zeimyth.Board.right);
					break;
				case 40: // down
					board.handleDirection(zeimyth.Board.down);
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
