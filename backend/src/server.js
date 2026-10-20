import app from './app.js';
import { config } from './config/env.js';

const PORT = config.port || 5000;

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  KETA GLOBAL HOLDINGS — ENTERPRISE B2B INQUIRY API   `);
  console.log(`  Port: ${PORT} | Environment: ${config.nodeEnv}     `);
  console.log(`  Health Check: http://localhost:${PORT}/api/health    `);
  console.log(`=======================================================`);
});
