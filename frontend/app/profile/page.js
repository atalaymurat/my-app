// app/profile/page.js
import { cookies } from "next/headers";
import { verifyIdToken  } from "../../lib/firebase-admin";
import { redirect } from "next/navigation";
import ProfileInfo from "../../components/ProfileInfo";
import EmailVerification from "../../components/EmailVerification";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  console.log("TOKEN::::", token);

  if (!token) {
    redirect("/auth");
    return null;
  }

  const decodedToken = await verifyIdToken(token.value);
  if (!decodedToken) {
    redirect("/auth");
    return null;
  }

  const user = decodedToken;
  const isVerified = user.emailVerified;

  return (
    <div className="p-8">
      <div className="text-2xl font-semibold">Profile Page</div>
      <ProfileInfo user={user} />
      <EmailVerification user={user} isVerified={isVerified} />
    </div>
  );
}
