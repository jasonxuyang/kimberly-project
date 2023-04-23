import { useRecoilState, useRecoilValue } from "recoil";

import accountsState from "@/recoil/accountsState";
import roleState from "@/recoil/roleState";
import { Role } from "@prisma/client";
import { useEffect } from "react";

export default function useRole() {
  const accounts = useRecoilValue(accountsState);
  const [role, setRole] = useRecoilState(roleState);

  useEffect(() => {
    const cachedRole = sessionStorage.getItem("_role");
    if (cachedRole) setRole(JSON.parse(cachedRole));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentRole = role;
  const setCurrentRole = (role: Role) => {
    switch (role) {
      case Role.PROFESSOR:
        if (accounts?.professor) setRole(Role.PROFESSOR);
        sessionStorage.setItem("_role", JSON.stringify(Role.PROFESSOR));
        break;
      case Role.TA:
        if (accounts?.assistant) setRole(Role.TA);
        sessionStorage.setItem("_role", JSON.stringify(Role.TA));
        break;
      case Role.STUDENT:
        if (accounts?.student) setRole(Role.STUDENT);
        sessionStorage.setItem("_role", JSON.stringify(Role.STUDENT));
        break;
    }
  };
  return { setCurrentRole, currentRole };
}
