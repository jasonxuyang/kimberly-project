import userState from "@/recoil/userState";
import { useRecoilState } from "recoil";
import { SignInProps, apiPost } from "../client";
import { ApiResponse } from "../types";

export default function useAuth() {
  const [user, setUser] = useRecoilState(userState);
  const isSignedIn = !!user;
  const signIn = async (credentials: SignInProps) => {
    const response: ApiResponse = await apiPost(
      "/api/auth/signin",
      credentials
    );
    if (!response.success) return false;

    const user = response.data;
    setUser(user);
    return true;
  };
  const signOut = () => {
    setUser(null);
    return true;
  };
  return { user, isSignedIn, signIn, signOut };
}
