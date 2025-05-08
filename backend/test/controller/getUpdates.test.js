const getUpdates = require("../../controllers/utils/getUpdates");

jest.mock("../../controllers/utils/helperFunctions", () => ({
  mergeArrays: jest.fn((current = [], incoming = []) => {
    const unique = incoming.filter((val) => !current.includes(val));
    return unique.length > 0 ? [...current, ...unique] : null;
  }),

  mergeObjectArrays: jest.fn((current = [], incoming = [], fields = []) => {
    const getKey = (obj) =>
      fields
        .map((f) => obj?.[f] ?? "")
        .join("|")
        .toLowerCase();
    const existingKeys = new Set(current.map(getKey));
    const newItems = incoming.filter((item) => !existingKeys.has(getKey(item)));
    return newItems.length > 0 ? [...current, ...newItems] : null;
  }),

  getFieldUpdates: jest.fn((current, incoming) => {
    const isEmpty = (val) =>
      val == null ||
      (Array.isArray(val) && val.length === 0) ||
      (typeof val === "object" && Object.keys(val).length === 0);
    return !isEmpty(incoming) && current !== incoming ? incoming : null;
  }),
}));

describe("getUpdates utility", () => {
  it("merges flat arrays and detects changes", () => {
    const existing = { emails: ["a@example.com"] };
    const incoming = { emails: ["a@example.com", "b@example.com"] };

    const result = getUpdates(existing, incoming, [
      { field: "emails", merge: true },
    ]);

    expect(result).toEqual({ emails: ["a@example.com", "b@example.com"] });
  });

  it("merges object arrays by key", () => {
    const existing = {
      phones: ["0905325502525"],
    };
    const incoming = {
      phones: ["0905325502526", "0905325502527"],
    };

    const result = getUpdates(existing, incoming, [
      { field: "phones", merge: true },
    ]);

    expect(result).toEqual({
      phones: ["0905325502525", "0905325502526", "0905325502527"],
    });
  });

  it("updates plain fields when value differs", () => {
    const existing = { name: "Alice" };
    const incoming = { name: "Bob" };

    const result = getUpdates(existing, incoming, [
      { field: "name", merge: false },
    ]);

    expect(result).toEqual({ name: "Bob" });
  });

  it("does not update if arrays are identical", () => {
    const existing = { emails: ["a@example.com"] };
    const incoming = { emails: ["a@example.com"] };

    const result = getUpdates(existing, incoming, [
      { field: "emails", merge: true },
    ]);

    expect(result).toBeNull();
  });

  it("does not update if object arrays are same after merge", () => {
    const existing = {
      phones: ["123"],
    };
    const incoming = {
      phones: ["123"],
    };

    const result = getUpdates(existing, incoming, ["123"]);

    expect(result).toBeNull();
  });

  it("handles empty existing fields gracefully", () => {
    const existing = {};
    const incoming = { emails: ["x@z.com"] };

    const result = getUpdates(existing, incoming, [
      { field: "emails", merge: true },
    ]);

    expect(result).toEqual({ emails: ["x@z.com"] });
  });

  it("returns null if no updates in plain fields", () => {
    const existing = { name: "Alice" };
    const incoming = { name: "Alice" };

    const result = getUpdates(existing, incoming, [
      { field: "name", merge: false },
    ]);

    expect(result).toBeNull();
  });
});
