const Offer = require("../models/offer/Offer");
const axios = require("axios");
const logger = require("../config/logger");
const axiosRetry = require("axios-retry").default;
const authAxios = axios.create({ timeout: 15000 });

// PDF service için ayrı axios instance
const pdfAxios = axios.create({
  timeout: 35000,
});

axiosRetry(authAxios, {
  retries: 2,
  retryDelay: (retryCount) => retryCount * 2000,
  retryCondition: (error) =>
    error.code === "ECONNABORTED" || axiosRetry.isNetworkError(error),
});

axiosRetry(pdfAxios, {
  retries: 2,
  retryDelay: (retryCount) => retryCount * 3000,
  retryCondition: (error) =>
    error.code === "ECONNABORTED" || axiosRetry.isNetworkError(error),
  onRetry: (retryCount) => {
    logger.info({ message: "pdf-service retry", attempt: retryCount });
  },
});

const pickOrganizationForPdf = (org = {}) => ({
  _id: org._id,
  name: org.name || "",
  logo: org.logo || "",
  phone: org.phone || "",
  email: org.email || "",
  address: org.address || "",
  website: org.website || "",
  taxNo: org.taxNo || "",
  bankAccounts: Array.isArray(org.bankAccounts) ? org.bankAccounts : [],
});

const pickUserForPdf = (user = {}) => ({
  _id: user._id,
  name: user.name || "",
  email: user.email || "",
  profilePicture: user.profilePicture || "",
  roles: Array.isArray(user.roles) ? user.roles : [],
  orgId: user.orgId || user.defaultOrgId || null,
  orgRole: user.orgRole || null,
  applicationId: user.applicationId || "",
});

module.exports = {
  offerPdf: async (req, res) => {
    try {
      const offer = await Offer.findById(req.params.id)
        .populate("company")
        .populate("contact")
        .exec();

      if (!offer)
        return res
          .status(404)
          .json({ message: "Teklif bulunamadı.", success: false });

      // Organizasyon bilgisini auth-service'ten çek
      let logoUrl = null;
      let bankAccounts = [];
      let organization = null;
      try {
        const token = req.cookies?.accessToken;
        if (token && process.env.AUTH_SERVICE_URL) {
          const orgRes = await authAxios.get(`${process.env.AUTH_SERVICE_URL}/api/org/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "x-internal-api-key": process.env.INTERNAL_API_KEY,
            },
          });
          organization = pickOrganizationForPdf(orgRes.data || {});
          logoUrl = organization.logo || null;
          bankAccounts = organization.bankAccounts;
        }
      } catch {
        // org verisi alınamazsa devam et
      }

      const user = pickUserForPdf(req.user || {});
      const offerObject = offer.toObject({ flattenMaps: true });
      let createdByUser = { _id: offerObject.createdBy || null };

      if (offerObject.createdBy?.toString?.() === user._id?.toString?.()) {
        createdByUser = user;
      } else if (offerObject.createdBy && process.env.AUTH_SERVICE_URL) {
        try {
          const creatorRes = await authAxios.get(
            `${process.env.AUTH_SERVICE_URL}/api/auth/users/${offerObject.createdBy}`,
            {
              params: user.applicationId ? { applicationId: user.applicationId } : undefined,
              headers: { "x-internal-api-key": process.env.INTERNAL_API_KEY },
            },
          );
          if (creatorRes.data?.user) {
            createdByUser = pickUserForPdf(creatorRes.data.user);
          }
        } catch {
          // creator bilgisi alınamazsa id ile devam et
        }
      }

      const pdfResponse = await pdfAxios.post(
        `${process.env.PDF_SERVICE_URL}/generate`,
        {
          template: offer.template || "quotation",
          data: {
            ...offerObject,
            logoUrl,
            bankAccounts,
            organization,
            user,
            createdByUser,
          },
        },
        {
          responseType: "arraybuffer",
          headers: { "x-internal-api-key": process.env.INTERNAL_API_KEY },
        },
      );

      const lastVersion = offer.versions[offer.versions.length - 1];

      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="offer-${lastVersion.docCode}.pdf"`,
      });

      res.send(pdfResponse.data);
    } catch (err) {
      logger.error({ message: "offerPdf error", error: err.message });
      res.status(500).json({ message: err.message, success: false });
    }
  },
};
