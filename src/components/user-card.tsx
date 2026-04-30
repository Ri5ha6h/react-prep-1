import type { User } from "../services/api";

export const UserCard = ({ user }: { user: User }) => {
  return (
    <div className="flex flex-col gap-2 text-lg text-white">
      <p>{user?.name}</p>
      <p>{user?.email}</p>
      <p>{user?.company?.name}</p>
    </div>
  );
};
