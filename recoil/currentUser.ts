import { atom } from "recoil";

const currentUser = atom({
  key: "currentUser",
  default: null,
});

export default currentUser;
