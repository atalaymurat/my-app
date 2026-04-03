const Contact = require("../../../models/contact/userContact");

// contactId varsa doğrula ve döndür, yoksa yeni kayıt oluştur
async function createOrFindContact({ contactId, contactName, contactPhone, contactEmail, companyId, userId }) {
  if (contactId) {
    const existing = await Contact.findById(contactId);
    if (existing) return existing._id;
  }

  if (!contactName?.trim()) return null;

  const contact = await Contact.create({
    name: contactName.trim(),
    phones: contactPhone ? [contactPhone] : [],
    emails: contactEmail ? [contactEmail.trim().toLowerCase()] : [],
    company: companyId || undefined,
    user: userId,
  });

  return contact._id;
}

module.exports = createOrFindContact;
