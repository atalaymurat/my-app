const adminOnly = (req, res, next) => {
  const role = req.user?.orgRole;
  if (req.isSuperAdmin || role === "admin" || role === "owner") return next();
  return res.status(403).json({ error: "Bu alana erişim yetkiniz yok." });
};

module.exports = adminOnly;
