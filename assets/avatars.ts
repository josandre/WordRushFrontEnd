// assets/avatars.ts

const avatars = {
  t4: require("./image/t4.png"),
  t4f: require("./image/t4f.png"),
  a5: require("./image/a5.png"),
  a6: require("./image/a6.png"),
  a12: require("./image/a12.png"),
  a14: require("./image/a14.png"),
  a16: require("./image/a16.png"),
  a18: require("./image/a18.png"),
  a19: require("./image/a19.png"),
  a20: require("./image/a20.png"),
  a21: require("./image/a21.png"),
  a22: require("./image/a22.png"),
  a23: require("./image/a23.png"),
  a24: require("./image/a24.png"),
  a27: require("./image/a27.png"),
  a28: require("./image/a28.png"),
  a29: require("./image/a29.png"),
  s1: require("./image/s1.png"),
  s4: require("./image/s4.png"),
  s5: require("./image/s5.png"),
  s12: require("./image/s12.png"),
  s13: require("./image/s13.png"),
  s24: require("./image/s24.png"),
  s25: require("./image/s25.png"),
  s26: require("./image/s26.png"),
  s27: require("./image/s27.png"),
  s47: require("./image/s47.png"),
};

export type AvatarId = keyof typeof avatars;
export default avatars;

export const getAvatarImage = (id?: string) => {
  return avatars[id as AvatarId] ?? avatars["t4f"];
};