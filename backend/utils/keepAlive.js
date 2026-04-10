const axios = require("axios");
const logger = require("../config/logger");

const PDF_SERVICE_URL = process.env.PDF_SERVICE_URL;

const pingPdfService = async () => {
  try {
    await axios.get(`${PDF_SERVICE_URL}/health`, { timeout: 5000 });
    logger.debug("keep-alive: pdf-service pinged OK");
  } catch (err) {
    logger.warn({ message: "keep-alive: pdf-service ping failed", error: err.message });
  }
};

// Hemen bir kez çalıştır (backend başlarken pdf-service'i uyandır)
pingPdfService();

// Her 10 dakikada bir ping at
setInterval(pingPdfService, 10 * 60 * 1000);

module.exports = { pingPdfService };
