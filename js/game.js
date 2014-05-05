goog.provide('zeimyth.game');

goog.require('zeimyth.Board');
goog.require('zeimyth.events');

zeimyth.game = {
	run: function() {
		var board = new zeimyth.Board();
		zeimyth.events.initialize(board);
	}
};

goog.exportSymbol('zeimyth.game.run', zeimyth.game.run);