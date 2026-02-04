import React from "react";
import type { User } from "../store/auth";

interface UserInfoCardProps {
  user: User;
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({ user }) => {
  if (!user) return null;

  return (
    <div className="mb-4 p-4 border rounded bg-gray-100">
      <div className="text-lg">
        <span className="font-semibold">Nome:</span> {user.name}
      </div>
      <div className="text-lg">
        <span className="font-semibold">E-mail:</span> {user.email}
      </div>
      <div className="text-lg">
        <span className="font-semibold">ID:</span> {user.id}
      </div>
    </div>
  );
};

export default UserInfoCard;
