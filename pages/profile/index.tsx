import useAuth from "@/utils/hooks/useAuth";
import Profile from "./[userId]";
import SignIn from "../signin";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function CurrentProfile() {
  const router = useRouter();
  const path = router.pathname;

  const { isSignedIn, user, signInRedirect } = useAuth();

  useEffect(() => {
    if (!isSignedIn) signInRedirect(router.pathname);
  });

  return <Profile uid={user?.id} />;
}
