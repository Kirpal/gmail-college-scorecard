var DEBUG = false;

/**
 * Typedef for events passed from Gmail to the add-on. Supplied for
 * reference.
 *
 * @typedef {Object} Event
 * @property {Object} parameters - Request parameters. Must include a 
 *    key "action" with the name of the action to dispatch
 * @property {Object} formInput - Values of input fields
 */

/**
 * Error handler
 * @callback ErrorHandler
 * @param {Error} exception - Exception to handle
 * @return {Card|ActionResponse|UnivseralActionResponse} optional card or action response to render
 */

/** 
 * Entry point for the add-on. Handles an user event and
 * invokes the corresponding action
 *
 * @param {Event} event - user event to process
 * @return {Card[]}
 */
function getContextualAddOn(event) {
  var message = getCurrentMessage(event);
  var school = extractSchool(message);

  if (school) {
    var card = buildCollegeCard(school);

    return card;
  }

  return [];
}

/**
 * Handle unexpected errors for the main universal action entry points.
 *
 * @param {Error} exception - Exception to handle
 * @return {Card|ActionResponse|UnivseralActionResponse} optional card or action response to render
 */
function addOnErrorHandler(err) {
  return buildErrorCard({
    exception: err,
    showStackTrace: DEBUG
  });
}
