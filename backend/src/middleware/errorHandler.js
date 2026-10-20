import { ZodError } from 'zod';

export function errorHandler(err, req, res, next) {
  const requestId = req.requestId || 'REQ-UNKNOWN';
  
  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message
    }));

    console.warn(`[${requestId}] Validation Error:`, formattedErrors);

    const firstErrorMessage = formattedErrors[0]?.message;
    const firstField = formattedErrors[0]?.field;

    return res.status(400).json({
      success: false,
      requestId,
      message: firstField ? `Validation failed for ${firstField}: ${firstErrorMessage}` : 'Validation failed for one or more fields',
      errors: formattedErrors
    });
  }

  // Handle generic server errors without leaking internals
  console.error(`[${requestId}] Internal Server Error:`, err.message);

  return res.status(err.status || 500).json({
    success: false,
    requestId,
    message: err.userMessage || 'An unexpected error occurred while processing your request. Please contact support.'
  });
}

export function notFoundHandler(req, res) {
  return res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`
  });
}
