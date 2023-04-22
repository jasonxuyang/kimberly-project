import { fetcher } from "@/utils/client";
import useAuth from "@/utils/hooks/useAuth";
import useSWR from "swr";

export type ProfileProps = {
  userId?: string;
};

export default function Profile({ userId }: ProfileProps) {
  const { user } = useAuth();
  const { data, error, isLoading } = useSWR(
    `/api/user/${userId ?? user?.id}`,
    fetcher
  );
  if (error) return <div>Error loading page.</div>;
  if (isLoading) return <div>Loading</div>;
  const userInfo = data;
  console.log(userInfo);
  return (
    <main>
      <div>First name: {userInfo?.firstName}</div>
      <div>Last name: {userInfo?.lastName}</div>
      <div>Email: {userInfo?.email}</div>
      <div>Password: {userInfo?.password}</div>
    </main>
  );
}
