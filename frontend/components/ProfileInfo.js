// ProfileInfo.js
"use client";
import Image from "next/image";

const ProfileInfo = ({ user }) => {
  return (
    <div>
      <div className="text-gray-600">
        Welcome, {user?.displayName || user?.email}
      </div>

      {user?.photoURL && (
        <Image
          src={user.photoURL}
          width={100}
          height={100}
          alt={user.displayName}
        />
      )}
    </div>
  );
};

export default ProfileInfo;