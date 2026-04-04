// middleware/editGuard.js
// Kullanım: editGuard(Model) — route'ta authenticate'den sonra ekle
// Örnek: router.put("/:id", authenticate, editGuard(Make), controller)

const editGuard = (Model) => async (req, res, next) => {
  try {
    // superadmin, owner, admin her kaydı düzenleyebilir
    if (req.isSuperAdmin) return next();

    const orgRole = req.user.orgRole; // token'da varsa
    if (orgRole === "owner" || orgRole === "admin") return next();

    // member: sadece kendi oluşturduğu kayıtları
    const doc = await Model.findOne({
      _id: req.params.id,
      organization: req.user.orgId,
    });

    if (!doc) return res.status(404).json({ error: "Kayıt bulunamadı." });
    if (doc.createdBy?.toString() !== req.user._id?.toString()) {
      return res.status(403).json({ error: "Bu kaydı düzenleme yetkiniz yok." });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = editGuard;
