const SERVICES = [
  {
    name: "auth-service",
    url: `${(process.env.AUTH_SERVICE_URL || "http://localhost:3022/api/auth").replace(/\/api\/auth$/, "")}/api/auth/health`,
  },
  {
    name: "pdf-service",
    url: `${process.env.PDF_SERVICE_URL || "http://localhost:3023"}/health`,
  },
];

const check = async (service) => {
  try {
    const res = await fetch(service.url, { signal: AbortSignal.timeout(5000) });
    const body = await res.json().catch(() => ({}));
    return { name: service.name, ok: res.ok, status: res.status, body };
  } catch (err) {
    return { name: service.name, ok: false, status: null, error: err.message };
  }
};

const runHealthChecks = async () => {
  console.log("--------------------------------");
  console.log("Service Health Checks:");
  const results = await Promise.all(SERVICES.map(check));
  results.forEach(({ name, ok, status, body, error }) => {
    if (ok) {
      console.log(`  ✓ ${name} — OK (${status})`, body);
    } else {
      console.warn(`  ✗ ${name} — FAIL`, error || `HTTP ${status}`);
    }
  });
  console.log("--------------------------------");
};

module.exports = { runHealthChecks };
