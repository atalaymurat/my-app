const mongoose = require("mongoose");

const DOC_TYPES = ["Teklif", "Proforma", "Fatura", "Sipariş", "Sözleşme"];
const CONTACT_GENDERS = ["male", "female", "none"];
const CONTACT_SOURCES = ["manual", "google", "kommo"];
const CONTACT_SOURCE_TYPES = ["manual", "google_csv", "kommo_csv"];
const PRICE_LIST_STATUSES = ["draft", "published", "archived"];

function isObjectId(value) {
  return typeof value === "string" && mongoose.Types.ObjectId.isValid(value);
}

function fail(res, message) {
  return res.status(400).json({ success: false, message });
}

function expectArray(body, key, res) {
  if (body[key] !== undefined && !Array.isArray(body[key])) {
    fail(res, `${key} bir dizi olmalı.`);
    return false;
  }
  return true;
}

function expectObjectIds(values, key, res) {
  if (!Array.isArray(values)) return true;
  if (values.some((value) => !isObjectId(value))) {
    fail(res, `${key} geçerli ObjectId değerleri içermeli.`);
    return false;
  }
  return true;
}

function hasCompanyInput(body) {
  return Boolean(
    body.companyId ||
      body.title?.trim() ||
      body.vatTitle?.trim() ||
      body.email ||
      body.domain ||
      body.city,
  );
}

function validateOfferPayload(req, res, next) {
  const body = req.body || {};

  if (!hasCompanyInput(body)) {
    return fail(res, "companyId veya firma bilgisi gerekli.");
  }
  if (body.companyId && !isObjectId(body.companyId)) {
    return fail(res, "companyId geçerli bir ObjectId olmalı.");
  }
  if (body.contactId && !isObjectId(body.contactId)) {
    return fail(res, "contactId geçerli bir ObjectId olmalı.");
  }
  if (body.priceListId && !isObjectId(body.priceListId)) {
    return fail(res, "priceListId geçerli bir ObjectId olmalı.");
  }
  if (body.docType !== undefined && !DOC_TYPES.includes(body.docType)) {
    return fail(res, "Geçersiz docType.");
  }
  if (!expectArray(body, "lineItems", res)) return;
  if (!expectArray(body, "offerTerms", res)) return;
  if (body.snapshotVersion !== undefined && Number.isNaN(Number(body.snapshotVersion))) {
    return fail(res, "snapshotVersion sayı olmalı.");
  }

  next();
}

function validateCompanyCreate(req, res, next) {
  const body = req.body || {};

  if (!body.title?.trim() && !body.vatTitle?.trim()) {
    return fail(res, "title veya vatTitle zorunludur.");
  }
  for (const key of ["phones", "emails", "domains", "addresses", "tags"]) {
    if (!expectArray(body, key, res)) return;
  }

  next();
}

function validateCompanyUpdate(req, res, next) {
  const body = req.body || {};

  for (const key of ["phones", "emails", "domains", "addresses", "tags"]) {
    if (!expectArray(body, key, res)) return;
  }

  next();
}

function validateContactCreate(req, res, next) {
  const body = req.body || {};
  const hasName =
    body.givenName?.trim() ||
    body.middleName?.trim() ||
    body.familyName?.trim();

  if (!hasName) return fail(res, "İsim parçalarından en az biri zorunludur.");
  if (body.gender !== undefined && !CONTACT_GENDERS.includes(body.gender)) {
    return fail(res, "Geçersiz gender.");
  }
  if (body.source !== undefined && !CONTACT_SOURCES.includes(body.source)) {
    return fail(res, "Geçersiz source.");
  }
  if (body.sourceType !== undefined && !CONTACT_SOURCE_TYPES.includes(body.sourceType)) {
    return fail(res, "Geçersiz sourceType.");
  }
  for (const key of ["phones", "formattedPhones", "emails", "googleLabels"]) {
    if (!expectArray(body, key, res)) return;
  }
  if (body.company && !isObjectId(body.company)) {
    return fail(res, "company geçerli bir ObjectId olmalı.");
  }

  next();
}

function validateContactUpdate(req, res, next) {
  const body = req.body || {};

  if (
    (body.givenName !== undefined || body.middleName !== undefined || body.familyName !== undefined) &&
    !body.givenName?.trim() &&
    !body.middleName?.trim() &&
    !body.familyName?.trim()
  ) {
    return fail(res, "isim parçaları boş olamaz.");
  }
  if (body.gender !== undefined && !CONTACT_GENDERS.includes(body.gender)) {
    return fail(res, "Geçersiz gender.");
  }
  if (body.source !== undefined && !CONTACT_SOURCES.includes(body.source)) {
    return fail(res, "Geçersiz source.");
  }
  if (body.sourceType !== undefined && !CONTACT_SOURCE_TYPES.includes(body.sourceType)) {
    return fail(res, "Geçersiz sourceType.");
  }
  for (const key of ["phones", "formattedPhones", "emails", "googleLabels"]) {
    if (!expectArray(body, key, res)) return;
  }
  if (body.company && !isObjectId(body.company)) {
    return fail(res, "company geçerli bir ObjectId olmalı.");
  }

  next();
}

function validatePriceListCreate(req, res, next) {
  const body = req.body || {};

  if (!body.title?.trim()) return fail(res, "title zorunludur.");
  if (!body.makeId || !isObjectId(body.makeId)) {
    return fail(res, "makeId geçerli bir ObjectId olmalı.");
  }
  for (const key of ["assignedOrgs", "selectedProducts"]) {
    if (!expectArray(body, key, res)) return;
    if (!expectObjectIds(body[key], key, res)) return;
  }

  next();
}

function validatePriceListUpdate(req, res, next) {
  const body = req.body || {};

  if (body.title !== undefined && !body.title?.trim()) {
    return fail(res, "title boş olamaz.");
  }
  if (body.status !== undefined && !PRICE_LIST_STATUSES.includes(body.status)) {
    return fail(res, "Geçersiz status.");
  }
  if (!expectArray(body, "selectedProducts", res)) return;
  if (!expectObjectIds(body.selectedProducts, "selectedProducts", res)) return;

  next();
}

function validatePriceListAssignments(req, res, next) {
  const body = req.body || {};

  if (!Array.isArray(body.orgIds)) return fail(res, "orgIds bir dizi olmalı.");
  if (!expectObjectIds(body.orgIds, "orgIds", res)) return;

  next();
}

function validateSnapshotItems(req, res, next) {
  if (!Array.isArray(req.body?.items)) return fail(res, "items bir dizi olmalı.");
  next();
}

module.exports = {
  validateCompanyCreate,
  validateCompanyUpdate,
  validateContactCreate,
  validateContactUpdate,
  validateOfferPayload,
  validatePriceListAssignments,
  validatePriceListCreate,
  validatePriceListUpdate,
  validateSnapshotItems,
};
