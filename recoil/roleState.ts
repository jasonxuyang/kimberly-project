import { Role } from "@prisma/client";
import { atom } from "recoil";

const roleState = atom<Role | null>({
  key: "role",
  default: null,
});

export default roleState;
