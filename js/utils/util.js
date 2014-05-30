goog.provide('zeimyth.util');

/**
 * @param {number=} bound
 * @param {number=} offset
 *
 * @return {number}
 */
zeimyth.util.getRandom = function(bound, offset) {
	if (bound === undefined) bound = 2;
	if (offset === undefined) offset = 0;
	
	return Math.floor(Math.random() * bound) + offset;
};
