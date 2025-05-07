// app/contact/page.js

import { Suspense } from "react";

// Client-side import için dinamik import kullanıyoruz
const ContactPage = require("@/components/contact/ContactPage").default;

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8">Sayfa yükleniyor...</div>}>
      <ContactPage />
    </Suspense>
  );
}