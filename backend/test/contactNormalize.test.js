const {
  normalizeContact,
  normalizeContactUpdate,
} = require("../controllers/utils/normalize");

describe("contact normalization", () => {
  test("manual contact create defaults source fields", () => {
    const normalized = normalizeContact(
      {
        givenName: "Ada",
        familyName: "Lovelace",
        emails: ["ADA@EXAMPLE.COM"],
        phones: ["+1 555"],
      },
      "507f1f77bcf86cd799439011",
      "507f1f77bcf86cd799439012",
    );

    expect(normalized).toMatchObject({
      displayName: "Ada Lovelace",
      normalizedName: "ada lovelace",
      emails: ["ada@example.com"],
      phones: ["+1 555"],
      source: "manual",
      sourceType: "manual",
    });
  });

  test("phone-only update does not erase email or import metadata fields", () => {
    const update = normalizeContactUpdate({ phones: ["+90 555"] });

    expect(update).toEqual({ phones: ["+90 555"] });
    expect(update.emails).toBeUndefined();
    expect(update.source).toBeUndefined();
    expect(update.sourceType).toBeUndefined();
    expect(update.importedAt).toBeUndefined();
    expect(update.sourceRowHash).toBeUndefined();
  });

  test("email-only update does not erase phone or display name part fields", () => {
    const update = normalizeContactUpdate({ emails: ["ADA@EXAMPLE.COM"] });

    expect(update).toEqual({ emails: ["ada@example.com"] });
    expect(update.phones).toBeUndefined();
    expect(update.givenName).toBeUndefined();
    expect(update.middleName).toBeUndefined();
    expect(update.familyName).toBeUndefined();
  });

  test("display name parts update derives display name with the same normalized contact shape", () => {
    const update = normalizeContactUpdate({
      givenName: "Ada",
      middleName: "M",
      familyName: "Lovelace",
    });

    expect(update).toMatchObject({
      displayName: "Ada M Lovelace",
      normalizedName: "ada m lovelace",
      givenName: "Ada",
      middleName: "M",
      familyName: "Lovelace",
    });
  });

});
