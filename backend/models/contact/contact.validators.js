module.exports = function applyContactValidators(schema) {
  schema.path("emails").validate(function (emails) {
    const uniqueEmails = new Set(emails.map((e) => e.address));
    return uniqueEmails.size === emails.length;
  }, "Aynı email birden fazla eklenemez");

  schema.path("phones").validate(function (phones) {
    const normalizePhone = (num) => num.replace(/[\s()-]/g, "");
    const uniquePhones = new Set(phones.map((p) => normalizePhone(p.number)));
    return uniquePhones.size === phones.length;
  }, "Aynı telefon numarası birden fazla eklenemez");
};
