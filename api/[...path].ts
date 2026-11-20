import app from '../server';

// Vercel invokes Node Functions with Node-compatible request/response objects,
// so the existing Express app can handle the request directly.
export default async function handler(req: any, res: any) {
  return app(req, res);
}
