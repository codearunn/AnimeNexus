// Purpose: Standardized error responses
class ErrorResponse extends Error{
  constructor(message, statusCode){
    super(message);  // Call built-in Error ===> this.message = message; as defined in its Error class
    this.statusCode=statusCode; // Attach HTTP code
  }
}

module.exports= ErrorResponse;