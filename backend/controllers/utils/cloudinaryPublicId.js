function extractCloudinaryPublicId(url = "") {
  if (typeof url !== "string") return null;

  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+(?:[?#].*)?$/);
  return match?.[1] || null;
}

module.exports = { extractCloudinaryPublicId };
