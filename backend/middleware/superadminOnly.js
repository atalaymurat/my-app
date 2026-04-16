const superadminOnly = (req, res, next) => {
  if (req.isSuperAdmin) return next();
  return res.status(403).json({ error: "Bu alana sadece superadmin erişebilir." });
};

module.exports = superadminOnly;
