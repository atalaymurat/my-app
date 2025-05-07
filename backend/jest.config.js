module.exports = {
  testEnvironment: "node", // Node.js ortamı
  setupFiles: ["<rootDir>/test/jest-setup.js"], // ortam değişkenleri burada yüklenir
  testMatch: ["**/test/**/*.test.js"], // test dosyalarının konumu
};