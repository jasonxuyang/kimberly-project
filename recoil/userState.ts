import { User } from "@prisma/client";
import { atom } from "recoil";

const userState = atom<User | null>({
  key: "user",
  default: null,
});

export default userState;
