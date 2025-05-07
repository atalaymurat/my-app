const formatDomain = (domain) => {
  if (domain && typeof domain === "string") {
    // Remove protocol (http:// or https://), "www.", and any trailing slashes
    return domain
      .replace(/^https?:\/\//, "") // Remove http:// or https://
      .replace(/^www\./, "") // Remove www.
      .replace(/\/$/, "") // Remove trailing slash
      .toLowerCase(); // Ensure the domain is lowercase
  }
  return domain;
};

module.exports = formatDomain;
