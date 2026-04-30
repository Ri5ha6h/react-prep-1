export const UserCard = ({ user }: { user: any }) => {
  return (
    <div className="flex flex-col gap-2 text-lg text-white">
      <p>{user?.name}</p>
      <p>{user?.email}</p>
      <p>{user?.phone}</p>
    </div>
  );
};
