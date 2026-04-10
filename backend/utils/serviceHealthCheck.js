const logger = require("../config/logger");

const SERVICES = [
  {
    name: "auth-service",
    url: `${process.env.AUTH_SERVICE_URL || "http://localhost:3022"}/api/auth/health`,
  },
  {
    name: "pdf-service",
    url: `${process.env.PDF_SERVICE_URL || "http://localhost:3023"}/health`,
  },
];

const check = async (service) => {
  try {
    const res = await fetch(service.url, {
      signal: AbortSignal.timeout(5000),
      headers: { "x-internal-api-key": process.env.INTERNAL_API_KEY || "" },
    });
    const body = await res.json().catch(() => ({}));
    return { name: service.name, ok: res.ok, status: res.status, body };
  } catch (err) {
    return { name: service.name, ok: false, status: null, error: err.message };
  }
};

const runHealthChecks = async () => {
  const results = await Promise.all(SERVICES.map(check));
  results.forEach(({ name, ok, status, body, error }) => {
    if (ok) {
      logger.info({ message: "Service health OK", name, status, body });
    } else {
      logger.warn({ message: "Service health FAIL", name, error: error || `HTTP ${status}` });
    }
  });
};

module.exports = { runHealthChecks };
