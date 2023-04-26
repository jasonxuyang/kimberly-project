import userState from "@/recoil/userState";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { SignInProps, apiPost } from "../client";
import { ApiResponse } from "../types";
import { useEffect } from "react";
import useAccounts from "./useAccounts";
import { useRouter } from "next/router";
import accountsState from "@/recoil/accountsState";
import roleState from "@/recoil/roleState";
import useRole from "./useRole";

export default function useAuth() {
  const router = useRouter();
  const [user, setUser] = useRecoilState(userState);
  const resetUser = useResetRecoilState(userState);
  const resetAccounts = useResetRecoilState(accountsState);
  const resetRole = useResetRecoilState(roleState);
  const { fetchAndSetAccounts } = useAccounts();
  const { defaultRole, setCurrentRole } = useRole();

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
    const accounts = await fetchAndSetAccounts(user.id);
    const role = defaultRole(accounts);
    if (role) setCurrentRole(role);
    sessionStorage.setItem("_user", JSON.stringify(user));
    return true;
  };
  const signOut = () => {
    resetUser();
    resetRole();
    resetAccounts();
    sessionStorage.clear();
    router.push("/");
    return true;
  };
  return { user, isSignedIn, signIn, signOut };
}
