const axios = require("axios");

const PDF_SERVICE_URL = process.env.PDF_SERVICE_URL;

const pingPdfService = async () => {
  try {
    await axios.get(`${PDF_SERVICE_URL}/health`, { timeout: 5000 });
    console.log("[keep-alive] pdf-service pinged OK");
  } catch (err) {
    console.log("[keep-alive] pdf-service ping failed:", err.message);
  }
};

// Hemen bir kez çalıştır (backend başlarken pdf-service'i uyandır)
pingPdfService();

// Her 10 dakikada bir ping at
setInterval(pingPdfService, 10 * 60 * 1000);

module.exports = { pingPdfService };
