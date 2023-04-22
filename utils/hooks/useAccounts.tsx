import userState from "@/recoil/userState";
import { useRecoilState } from "recoil";
import { fetchAccounts } from "../client";
import { ApiResponse } from "../types";
import { useEffect } from "react";
import accountsState from "@/recoil/accountsState";
import { Role } from "@prisma/client";

export default function useAccounts() {
  const [accounts, setAccounts] = useRecoilState(accountsState);

  useEffect(() => {
    const cachedAccount = sessionStorage.getItem("_accounts");
    if (cachedAccount) setAccounts(JSON.parse(cachedAccount));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasAccount = (role: Role) => {
    switch (role) {
      case Role.PROFESSOR:
        return !!accounts?.professor;
      case Role.TA:
        return !!accounts?.assistant;
      case Role.STUDENT:
        return !!accounts?.student;
    }
  };

  const fetchAndSetAccounts = async (userId: string) => {
    const response: ApiResponse = await fetchAccounts(userId);
    const { success, data } = response;
    if (success) {
      setAccounts(data);
      sessionStorage.setItem("_accounts", JSON.stringify(data));
    }
  };

  return { hasAccount, fetchAndSetAccounts };
}
