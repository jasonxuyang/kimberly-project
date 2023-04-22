import userState from "@/recoil/userState";
import { useRecoilState } from "recoil";
import { SignInProps, apiPost } from "../client";
import { ApiResponse } from "../types";
import { useEffect } from "react";
import useAccounts from "./useAccounts";

export default function useAuth() {
  const [user, setUser] = useRecoilState(userState);
  const { fetchAndSetAccounts } = useAccounts();

  useEffect(() => {
    const cachedUser = sessionStorage.getItem("_user");
    if (cachedUser) setUser(JSON.parse(cachedUser));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isSignedIn = !!user;
  const signIn = async (credentials: SignInProps) => {
    const response: ApiResponse = await apiPost(
      "/api/auth/signin",
      credentials
    );
    if (!response.success) return false;

    const user = response.data;
    setUser(user);
    await fetchAndSetAccounts(user.id);
    sessionStorage.setItem("_user", JSON.stringify(user));
    return true;
  };
  const signOut = () => {
    setUser(null);
    sessionStorage.clear();
    return true;
  };
  return { user, isSignedIn, signIn, signOut };
}
