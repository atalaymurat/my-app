const {
  buildGoogleCsvContactDisplayName,
  normalizeGoogleCsvContactRow,
} = require("../controllers/utils/contact/googleCsvContact");

describe("googleCsvContact", () => {
  test("builds contact display name from first, middle, and last name", () => {
    expect(
      buildGoogleCsvContactDisplayName({
        "First Name": "Ada",
        "Middle Name": "M",
        "Last Name": "Lovelace",
      }),
    ).toBe("Ada M Lovelace");
  });

  test("maps numbered email and phone values into flat arrays", () => {
    const contact = normalizeGoogleCsvContactRow(
      {
        "First Name": "Ada",
        "Middle Name": "M",
        "Last Name": "Lovelace",
        "Name Prefix": "Ignored",
        "Organization Name": "Ignored Corp",
        "E-mail 1 - Label": "Work",
        "E-mail 1 - Value": "ADA@EXAMPLE.COM",
        "E-mail 2 - Value": "other@example.com",
        "Phone 1 - Label": "Mobile",
        "Phone 1 - Value": "+1 (555) 123-4567",
        "Phone 2 - Value": "555 987 6543",
        "Event 1 - Value": "ignored",
        "Custom Field 1 - Value": "ignored",
      },
      "507f1f77bcf86cd799439011",
      "507f1f77bcf86cd799439012",
    );

    expect(contact).toMatchObject({
      displayName: "Ada M Lovelace",
      givenName: "Ada",
      middleName: "M",
      familyName: "Lovelace",
      emails: ["ada@example.com", "other@example.com"],
      phones: ["+1 (555) 123-4567", "555 987 6543"],
      source: "google",
      sourceType: "google_csv",
    });
    expect(contact.organizationName).toBeUndefined();
    expect(contact.sourceRowHash).toEqual(expect.any(String));
  });
});
