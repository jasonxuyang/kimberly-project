import { fetcher } from "@/utils/client";
import useAuth from "@/utils/hooks/useAuth";
import useSWR from "swr";
import PageNotFound from "../PageNotFound";

export default function Profile() {
  const { user, isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <PageNotFound />;
  }

  return (
    <main>
      <div>First name: {user?.firstName}</div>
      <div>Last name: {user?.lastName}</div>
      <div>Email: {user?.email}</div>
      <div>Password: {user?.password}</div>
    </main>
  );
}
