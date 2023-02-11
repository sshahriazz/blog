import { atomWithStorage } from "jotai/utils";
import { atomWithImmer } from "jotai-immer";
import { UserProfile } from "types/profile";
export const contentAtom = atomWithStorage("content", "");
export const profileAtom = atomWithImmer<UserProfile>([
  {
    key: "selfInfo",
    username: "",
    bio: "",
    image: "",
    followings: [""],
    followers: [""],
  },
  [
    {
      descriptions: [""],
      images: [""],
      githubLink: "",
      key: "pro-project",
      liveLink: "",
      name: "",
    },
    {
      descriptions: [""],
      images: [""],
      githubLink: "",
      key: "pro-project",
      liveLink: "",
      name: "",
    },
  ],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
]);
