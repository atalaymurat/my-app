// app/profile/page.js
"use client";
import { useAuth } from "../../context/AuthContext";
import ProfileInfo from "../../components/ProfileInfo";
import EmailVerification from "../../components/EmailVerification";


export default function ProfilePage() {
  const { user, loading, authChecked } = useAuth();
  console.log("PROFILE:USER:", user)


  if (loading) {
    return <div>Loading authentication status...</div>;
  }


  if (!user) {
    return <div className="p-8">Loading profile data...</div>;
  }

  return (
    <div className="p-8">
      <ProfileInfo user={user} />
      <EmailVerification 
        user={user} 
        isVerified={user.emailVerified} 
      />
    </div>
  );
}