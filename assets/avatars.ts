/* eslint-disable @typescript-eslint/no-require-imports */
// assets/avatars.ts
const avatars = {
  a5: require("./avatars/a5.png"),
  a6: require("./avatars/a6.png"),
  a12: require("./avatars/a12.png"),
  a14: require("./avatars/a14.png"),
  a16: require("./avatars/a16.png"),
  a18: require("./avatars/a18.png"),
  a19: require("./avatars/a19.png"),
  a20: require("./avatars/a20.png"),
  a21: require("./avatars/a21.png"),
  a22: require("./avatars/a22.png"),
  a23: require("./avatars/a23.png"),
  a24: require("./avatars/a24.png"),
  default: require("./avatars/default.png"),
};

export type AvatarId = keyof typeof avatars;
export default avatars;

export const getAvatarImage = (id?: string) => {
  return avatars[id as AvatarId] ?? avatars["default"];
};
