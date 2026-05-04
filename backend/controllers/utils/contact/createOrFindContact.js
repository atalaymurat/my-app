const Contact = require("../../../models/contact/Contact");
const { normalizeContact, splitContactDisplayName } = require("../../utils/normalize");

// contactId varsa doğrula ve döndür, yoksa yeni kayıt oluştur
async function createOrFindContact({
  contactId,
  contactName,
  contactPhone,
  contactEmail,
  companyId,
  userId,
  orgId,
}) {
  if (contactId) {
    const existing = await Contact.findById(contactId);
    if (existing) return existing._id;
  }

  if (!contactName?.trim()) return null;

  const normalized = normalizeContact(
    {
      ...splitContactDisplayName(contactName),
      phones: contactPhone ? [contactPhone] : [],
      emails: contactEmail ? [contactEmail] : [],
      company: companyId,
    },
    userId,
    orgId
  );

  const contact = await Contact.create(normalized);

  return contact._id;
}


module.exports = createOrFindContact;
