import crypto from "crypto";

export const generateRef = (length = 0, alphaNum = false) => {
  // if alphaNum = true generate alphanumeric code
  let code = "";
  if (alphaNum == true && length > 0) {
    let len = Math.round(length / 2);
    code = crypto.randomBytes(len).toString("hex");
    code = code.slice(0, length);
  } else if (length > 0) {
    for (let i = 0; i < length; i++) {
      code += Math.floor(Math.random() * 10);
    }
  } else {
    throw new Error("Length must be greater than zero");
  }

  return code;
};
console.log(generateRef(1));
