// backend/config/corsOptions.js

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.BACKEND_URL,
  "http://localhost:3000",
  "https://postiva-atalaymurats-projects.vercel.app",
  "https://postiva-server.onrender.com",
  // Vercel deployment patterns
  /\.vercel\.app$/,
  /\.vercel\.sh$/,
  /\.now\.sh$/,
  /postiva-.*-atalaymurats-projects\.vercel\.app$/, // Vercel preview deployments
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Check against exact matches
    if (allowedOrigins.some((allowed) => allowed === origin)) {
      return callback(null, true);
    }

    // Check against regex patterns (for Vercel URLs)
    if (
      allowedOrigins.some((allowed) => {
        return allowed instanceof RegExp && allowed.test(origin);
      })
    ) {
      return callback(null, true);
    }

    console.warn(`CORS: Denied origin - ${origin}`);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  exposedHeaders: ["set-cookie"],
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Cookie",
    "Access-Control-Allow-Credentials",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Methods",
    "Access-Control-Allow-Headers",
    // Vercel specific headers
    "x-forwarded-for",
    "x-forwarded-host",
    "x-forwarded-proto",
    "x-real-ip",
    "x-vercel-deployment-url",
    "x-vercel-id",
    "x-vercel-ip-as-number",
    "x-vercel-ip-city",
    "x-vercel-ip-continent",
    "x-vercel-ip-country",
    "x-vercel-ip-country-region",
    "x-vercel-ip-latitude",
    "x-vercel-ip-longitude",
    "x-vercel-ip-postal-code",
    "x-vercel-ip-timezone",
    "x-vercel-ja4-digest",
    "x-vercel-proxied-for"
  ],
};

module.exports = { corsOptions, allowedOrigins };
