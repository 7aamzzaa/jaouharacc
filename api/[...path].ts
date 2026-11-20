import app from '../server';

// Vercel Node Functions receive the standard Node (req, res) pair,
// which is exactly what the Express application expects. Keeping the
// handler here preserves all existing same-origin /api/* routes.
export default app;
