import serverless from '../../backend/node_modules/serverless-http/serverless-http.js';
import app from '../../backend/src/app.js';

export const handler = serverless(app);
