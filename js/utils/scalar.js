goog.provide('zeimyth.util.scalar');

/**
 * @param  {number} count Number of iterations
 * @param  {?function(this:S, number, number=):boolean} f Function to call in some
 * @param  {S=} opt_obj Optional "this" in function
 * 
 * @return {boolean}
 * 
 * @template S
 */
zeimyth.util.scalar.forSome = function(count, f, opt_obj) {
	return goog.array.some(zeimyth.util.scalar.generateIncrementingArray(count), f, opt_obj);
};

/**
 * @param  {number} count Number of iterations
 * @param  {?function(this:S, number, number=)} f Function to call in forEach
 * @param  {S=} opt_obj Optional "this" in function
 * 
 * @template S
 */
zeimyth.util.scalar.forEach = function(count, f, opt_obj) {
	goog.array.forEach(zeimyth.util.scalar.generateIncrementingArray(count), f, opt_obj);
};

/**
 * @param  {number} size The size of the array to fill
 * 
 * @return {Array.<number>}
 * 
 * @private
 */
zeimyth.util.scalar.generateIncrementingArray = function(size) {
	/** @type {Array.<number>} */
	var args = [];

	for (var i = 0; i < size; i++) {
		args.push(i);
	}

	return args;
};
