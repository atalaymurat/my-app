// app/profile/page.js
import ProfileInfo from "@/components/profile/ProfileInfo";
import PageLinks from "@/components/templates/PageLinks";

export default function ProfilePage() {
  return (
    <div className="p-8 flex flex-col gap-4">
      <ProfileInfo />
      <PageLinks
        links={[
          { href: "/shield/company", label: "Firmalar" },
          { href: "/shield/contact", label: "Kisiler" },
          { href: "/shield/master", label: "Mastar Urunler" },
          { href: "/shield/option", label: "Opsiyonlar" },
          { href: "/shield/variant", label: "Urunler" },
          { href: "/shield/offer", label: "Teklifler" },
        ]}
      />
    </div>
  );
}
