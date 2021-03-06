/* jshint browser: true */
/**
 * EndPool – https://github.com/wcst/end-pool
 * v0.0.1
 *
 * Listen for collection of css transitions to report as finished 
 * -or-
 * Listen for all css transitions to finish on a set of elements
 * 
 */
(function (w) {

  'use strict';

  /**
   * Utility lookup to properly vendor prefix `transitionend` event
   * @return {String} Vendor prefixed transitionend
   */
  var _getPrefix = function () {
    var lookup = {
      'MozTransition': 'transitionend',
      'WebkitTransition': 'webkitTransitionEnd',
      'transition': 'transitionEnd',
      'MSTransition': 'msTransitionEnd',
      'OTransition': 'oTransitionEnd'
    },
    div = document.createElement('div');

    for (var t in lookup) {
      if (div.style[t] !== undefined) return lookup[t];
    }
  };


  /**
   * Constructor method to instantiate new instance of EndPool
   * @return {[type]} [description]
   */
  var EndPool = function () {
    // Cache vendor prefixed event name on this instance
    this.endEvent = _getPrefix();
  };

  /**
   * Listen for end of all transitions on single element
   * @param  {Element}  element DOM Node
   * @param  {Number}   pool    Number of transitions to listen for
   * @param  {Function} cb      Callback to apply upon completion
   * @param {Object}    ctxt Optional context to invoke callback as
   * @return {[type]}           [description]
   */
  EndPool.prototype.listenForEndOf = function (element, pool, cb, ctxt) {
    
    var poolCount = 1, // Start at 1 and count up
        
        // Shorthand lookup of event name
        end = this.endEvent,

        // Set context of callback method
        context = (typeof ctxt !== 'undefined') ? ctxt : element,
        
        // Local & private methods
        _handler,
        _afterAll;

    /**
     * Event handler triggered when browser sends `transitionend`
     * @param  {Object} evt Native DOM event object
     * @return {[type]}     [description]
     */
    _handler = function (evt) {
      poolCount++;
      if (poolCount >= pool) _afterAll();
    };


    /**
     * Method to be applied when our pool has filled up
     * @return {[type]} [description]
     */
    _afterAll = function () {
      
      /**
       * Remove event listener on this element because
       * we are good citizens and don't need any memory leaks
       */
      element.removeEventListener(end, _handler);
      
      /**
       * Ensure `cb` is a function and invoke it in the
       * previously cet context
       *
       * NOTE: The callback is executed on a delay to account for 
       * any mismatches in the transitionend triggers
       * 
       */
      if (typeof cb === 'function') {
        setTimeout(function () {
          cb.call(context, null);
        }, 500);
      }
    };

    /**
     * Add event listener
     */
    element.addEventListener(end, _handler);
  };


  /**
   * Listen for the end of all transitions on all elements passed in
   * @param  {Array}   items    Set of DOM elements
   * @param  {Number}   pool    Number of transitions to listen for (per item)
   * @param  {Function} cb      Callback to apply upon completion
   * @param {Object} ctxt Optional context to invoke callback as 
   * @return {[type]}         [description]
   */
  EndPool.prototype.listenForEndOfAll = function (items, pool, cb, ctxt) {

    // Count of items that have reported back as finished
    var itemsReported = 0,

        context = (typeof ctxt !== undefined) ? ctxt : null,

        reportBack;

    /**
     * Callback assigned to each instance of `listenForEndOf`
     * @return {[type]} [description]
     */
    reportBack = function () {
      itemsReported++;
      // Once all items have reported back, execute callback
      if (itemsReported === items.length)
        if (typeof cb === 'function') cb.call(context, null);
    };

    /**
     * Iterate over items passed in and listenForEndOf on each
     * @param  {[type]} el [description]
     * @return {[type]}    [description]
     */
    [].forEach.call(items, function (el) {
      this.listenForEndOf(el, pool, reportBack);
    }, this);
  };


  /**
   * Transport
   */
  if (typeof define === 'function' && define.amd) {
    define(function () {
      return EndPool;
    });
  } else {
    w.EndPool = EndPool;
  }

})(window);