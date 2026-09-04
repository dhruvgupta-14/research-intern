/**
 * Error handling.
 *
 * `HttpError` lets a route fail with a status without hand-writing a res.json
 * at every branch; `asyncRoute` forwards rejected promises to Express 5's
 * error pipeline; `errorHandler` turns anything that reaches it into JSON
 * rather than an HTML stack trace.
 */

class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    if (details) this.details = details;
  }
}

const asyncRoute = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

function notFound(req, res) {
  res.status(404).json({ error: `No route for ${req.method} ${req.originalUrl}` });
}

function errorHandler(err, req, res, _next) {
  const status = err.status || 500;
  if (status >= 500) {
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`, err);
  }
  res.status(status).json({
    error: status >= 500 ? "Internal server error" : err.message,
    ...(err.details ? { details: err.details } : {}),
  });
}

module.exports = { HttpError, asyncRoute, notFound, errorHandler };
