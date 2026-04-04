const cloudinary = require("../config/cloudinary");

// Genel upload fonksiyonu — buffer'dan Cloudinary'e yükler
const uploadToCloudinary = (buffer, folder = "postiva") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(buffer);
  });
};

// POST /api/upload
const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "Dosya bulunamadı." });

    const folder = req.query.folder || "postiva";
    const result = await uploadToCloudinary(req.file.buffer, folder);

    res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { uploadImage, uploadToCloudinary };
