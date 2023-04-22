import { useRecoilState, useRecoilValue } from "recoil";

import accountsState from "@/recoil/accountsState";
import roleState from "@/recoil/roleState";
import { Role } from "@prisma/client";

export default function useRole() {
  const accounts = useRecoilValue(accountsState);
  const [role, setRole] = useRecoilState(roleState);

  const currentRole = role;
  const setCurrentRole = (role: Role) => {
    if (accounts) {
      switch (role) {
        case Role.PROFESSOR:
          if (accounts.professor) setRole(Role.PROFESSOR);
          break;
        case Role.TA:
          if (accounts.assistant) setRole(Role.TA);
          break;
        case Role.STUDENT:
          if (accounts.student) setRole(Role.STUDENT);
          break;
      }
    }
  };
  return { setCurrentRole, currentRole };
}
