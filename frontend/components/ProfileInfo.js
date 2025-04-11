// ProfileInfo.js
"use client";
import Image from "next/image";

const ProfileInfo = ({ user }) => {
  return (
    <div>
      <div className="text-gray-600">Welcome, {user?.name || user?.email}</div>

      {user?.profilePicture && (
        <Image
          src={user.profilePicture}
          width={100}
          height={100}
          alt={user.name}
          priority={true} // Critical for LCP elements
          className="rounded-xl"
          quality={75} // Optimal balance between quality and size
          unoptimized={false} // Let Next.js optimize the image
        />
      )}
    </div>
  );
};

export default ProfileInfo;
