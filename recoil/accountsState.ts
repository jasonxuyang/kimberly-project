import { Assistant, Professor, Role, Student } from "@prisma/client";
import { atom } from "recoil";

type AccountsState = {
  student?: Student;
  professor?: Professor;
  assistant?: Assistant;
};
const accountsState = atom<AccountsState | null>({
  key: "account",
  default: null,
});

export default accountsState;
