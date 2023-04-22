import { fetcher } from "@/utils/client";
import useAuth from "@/utils/hooks/useAuth";
import { User } from "@prisma/client";
import useSWR from "swr";
import PageNotFound from "../PageNotFound";
import { useRouter } from "next/router";

export default function Profile() {
  const { user, isSignedIn } = useAuth();
  const { query } = useRouter();
  const userId = query.userId;
  const { data, isLoading } = useSWR(`/api/user/${userId}`, fetcher);
  if (isLoading) return <main>Loading...</main>;
  if (!data.success) return <PageNotFound />;

  const userInfo: User = data.data;
  const hasPermissions = isSignedIn && user?.id === userInfo.id;
  return (
    <main>
      <div>First name: {userInfo?.firstName}</div>
      <div>Last name: {userInfo?.lastName}</div>
      <div>Email: {userInfo?.email}</div>
      {hasPermissions && <div>Password: {userInfo.password}</div>}
    </main>
  );
}
