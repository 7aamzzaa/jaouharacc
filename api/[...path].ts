import { createRequire } from 'node:module';

// npm run build emits dist/server.cjs. Vercel includes it in the function
// bundle via vercel.json functions.includeFiles, preserving the dist/ path.
// Since this package is ESM, explicitly load the CommonJS bundle and unwrap
// the app.
const nodeRequire = createRequire(import.meta.url);
const serverModule = nodeRequire('../dist/server.cjs');
const app = serverModule.default ?? serverModule.app ?? serverModule;

// Vercel invokes Node Functions with Node-compatible request/response objects,
// so the existing Express app can handle the request directly.
export default async function handler(req: any, res: any) {
  return app(req, res);
}
