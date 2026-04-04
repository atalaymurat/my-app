// Dikdörtgen görseli beyaz arka plan üzerinde kareye dönüştürür
export function toSquareImage(file, size = 800) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");

      // Beyaz arka plan
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);

      // Görseli ortala (en-boy oranı korunur)
      const scale = Math.min(size / img.width, size / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      const x = (size - w) / 2;
      const y = (size - h) / 2;
      ctx.drawImage(img, x, y, w, h);

      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        resolve(new File([blob], file.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" }));
      }, "image/jpeg", 0.92);
    };
    img.src = url;
  });
}
