const { Contact  } = require("../../../models/contact/contact.model");
const getUpdates = require("../getUpdates");

const updateContact = async (contact, data) => {
  const fieldsToCompare = [
    { field: "emails", value: data.emails, merge: true },
    { field: "phones", value: data.phones, merge: true },
  ];
  // getUpdates kullanarak farkları alıyoruz
  const updates = getUpdates(contact, data, fieldsToCompare);

  // Eğer herhangi bir güncelleme varsa
  if (updates) {
    const updateLogs = [];

    // Güncellenmiş alanları logluyoruz
    for (const [field, updatedValue] of Object.entries(updates)) {
      updateLogs.push({
        field,
        previous: contact[field],
        updated: updatedValue,
      });
    }
    // Veritabanında güncellemeleri yapıyoruz
    await Contact.findByIdAndUpdate(
      contact._id,
      { $set: updates },
      { new: true },
    );

    // Güncelleme loglarını konsola yazıyoruz
    console.log(`📝 [Contact Update Log] Contact ID: ${contact._id}`);
    updateLogs.forEach((log) => {
      console.log(
        `→ ${log.field} updated\n   - Previous: ${JSON.stringify(log.previous, null, 2)}\n   - New:      ${JSON.stringify(log.updated, null, 2)}`,
      );
    });

    // Güncellenmiş kaydı döndürüyoruz
    return await Contact.findById(contact._id);
  }

  // Eğer herhangi bir güncelleme yoksa, mevcut kaydı geri döndürüyoruz
  return contact;
};

module.exports = updateContact;
