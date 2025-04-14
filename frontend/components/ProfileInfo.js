// ProfileInfo.js
"use client";
import Image from "next/image";
import { localeDate } from "../lib/helpers";

const ProfileInfo = ({ user }) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="text-gray-600">
        <div className="text-2xl font-bold">
          Welcome, {user?.name || user?.email}
        </div>
        <div className="text-sm">
           {user.isAdmin ? "Admin" : "User"} since {localeDate(user.createdAt)}
        </div>
      </div>

      {user?.profilePicture && (
        <Image
          src={user.profilePicture}
          width={100}
          height={100}
          alt={user.name}
          priority={true} // Critical for LCP elements
          className="rounded-xl justify-self-end"
          quality={75} // Optimal balance between quality and size
          unoptimized={false} // Let Next.js optimize the image
        />
      )}
    </div>
  );
};

export default ProfileInfo;
