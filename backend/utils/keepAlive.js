const axios = require("axios");
const logger = require("../config/logger");

const SERVICES = [
  { name: "pdf-service",  url: `${process.env.PDF_SERVICE_URL}/health` },
  { name: "auth-service", url: `${process.env.AUTH_SERVICE_URL || "https://auth.postiva.uk"}/api/auth/health` },
];

const pingAll = async () => {
  for (const svc of SERVICES) {
    try {
      await axios.get(svc.url, { timeout: 10000 });
      logger.debug(`keep-alive: ${svc.name} pinged OK`);
    } catch (err) {
      logger.warn({ message: `keep-alive: ${svc.name} ping failed`, error: err.message });
    }
  }
};

pingAll();
setInterval(pingAll, 14 * 60 * 1000);

module.exports = { pingAll };
