const {
  buildKommoCsvContactDisplayName,
  normalizeKommoCsvContactRow,
} = require("../controllers/utils/contact/kommoCsvContact");

describe("kommoCsvContact", () => {
  test("builds contact display name from Kommo given and family columns", () => {
    expect(
      buildKommoCsvContactDisplayName({
        "İsim": "Furkan Dream Done Mersin",
        "Ad": "Furkan",
        "Soyisim": "Soyad",
      }),
    ).toBe("Furkan Soyad");
  });

  test("maps Kommo email and phone columns into flat arrays", () => {
    const contact = normalizeKommoCsvContactRow(
      {
        ID: "122744739",
        Tip: "i̇letişim",
        "İsim": "Furkan Dream Done Mersin",
        "Ad": "Furkan",
        "Soyisim": "Soyad",
        "Şirket": "",
        "Oluşturulma tarihi": "31.01.2026 12:17:25",
        "Tarafından oluşturuldu:": "Murat ATALAY",
        "Değiştirildi:": "31.01.2026 12:17:25",
        "Tarafından değiştirildi:": "Murat ATALAY",
        Etiketler: "",
        "İş e-postası": "WORK@EXAMPLE.COM, other@example.com",
        "Kişisel e-posta": "personal@example.com",
        "Diğer e-posta": "",
        "İş telefonu": "",
        "İş DD telefonu": "",
        "Cep telefonu": "905324381103",
        Faks: "",
        "Ev telefonu": "",
        "Diğer telefon": "905551112233",
        "Not 1": "ignored",
      },
      "507f1f77bcf86cd799439011",
      "507f1f77bcf86cd799439012",
    );

    expect(contact).toMatchObject({
      displayName: "Furkan Soyad",
      normalizedName: "furkan soyad",
      givenName: "Furkan",
      middleName: "",
      familyName: "Soyad",
      emails: ["work@example.com", "other@example.com", "personal@example.com"],
      phones: ["905324381103", "905551112233"],
      source: "kommo",
      sourceType: "kommo_csv",
      sourceRowHash: "kommo:122744739",
    });
    expect(contact["Not 1"]).toBeUndefined();
  });

  test("ignores Kommo İsim for import name mapping", () => {
    const contact = normalizeKommoCsvContactRow({
      "İsim": "Full Name From Kommo",
      "Ad": "",
      "Soyisim": "Soyad",
    });

    expect(contact).toMatchObject({
      displayName: "Soyad",
      givenName: "",
      middleName: "",
      familyName: "Soyad",
    });
  });
});
