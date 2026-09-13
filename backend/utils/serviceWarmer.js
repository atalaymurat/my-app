const axios = require("axios");
const logger = require("../config/logger");

const serviceUrls = () => [
  { name: "pdf-service", url: process.env.PDF_SERVICE_URL ? `${process.env.PDF_SERVICE_URL}/health` : null },
  { name: "auth-service", url: `${process.env.AUTH_SERVICE_URL || "https://auth.postiva.uk"}/api/auth/health` },
];

const pingService = async (service) => {
  if (!service?.url) return;

  try {
    await axios.get(service.url, { timeout: 10000 });
    logger.debug(`keep-alive: ${service.name} pinged OK`);
  } catch (err) {
    logger.warn({ message: `keep-alive: ${service.name} ping failed`, error: err.message });
  }
};

const warmPdfService = () => {
  const pdfService = serviceUrls().find((service) => service.name === "pdf-service");
  setImmediate(() => pingService(pdfService));
};

module.exports = { pingService, warmPdfService };
