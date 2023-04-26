import { useRecoilState } from "recoil";
import { AccountAndRole, fetchAccounts } from "../client";
import { ApiResponse } from "../types";
import { useEffect } from "react";
import accountsState from "@/recoil/accountsState";
import { Role } from "@prisma/client";
import useRole from "./useRole";

export default function useAccounts() {
  const [accounts, setAccounts] = useRecoilState(accountsState);
  const { currentRole } = useRole();

  useEffect(() => {
    const cachedAccounts = sessionStorage.getItem("_accounts");
    if (cachedAccounts) setAccounts(JSON.parse(cachedAccounts));
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

  const currentAccount = () => {
    if (!currentRole) return;
    switch (currentRole) {
      case Role.PROFESSOR:
        return accounts?.professor;
      case Role.TA:
        return accounts?.assistant;
      case Role.STUDENT:
        return accounts?.student;
    }
  };

  const fetchAndSetAccounts = async (userId: string) => {
    const response: ApiResponse = await fetchAccounts(userId);
    const { success, data } = response;
    if (success) {
      setAccounts(data);
      sessionStorage.setItem("_accounts", JSON.stringify(data));
      return data;
    }
  };

  return {
    hasAccount,
    fetchAndSetAccounts,
    currentAccount: currentAccount(),
  };
}
