// app/contact/page.js

import { Suspense } from "react";
import ContactPage from "@/components/contact/ContactPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8">Sayfa yükleniyor...</div>}>
      <ContactPage />
    </Suspense>
  );
}
