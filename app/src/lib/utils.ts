import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
const CHARS = "0123456789abcdefghijklmnopqrstuvwxyz";


export const getLast = (input?: string): string => {

  if (input === undefined) {
    let result = "";
    const len = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < len; i++) {
      result += CHARS[Math.floor(Math.random() * CHARS.length)];
    }
    return result;
  }

  // 在最后一个字符的 ASCII 值上 +10
  const lastChar = input[input.length - 1];
  const idx = CHARS.indexOf(lastChar);
  if (idx < CHARS.length - 1) {
    return input.slice(0, -1) + CHARS[idx + 10];
  }
  // 最后一位已是最大字符，追加一个中间字符
  return input + CHARS[Math.floor(CHARS.length / 2)];
};

export const getFirst = (input: string): string => {
  const lastChar = input[input.length - 1];
  const idx = CHARS.indexOf(lastChar);
  if (idx > 0) {
    return input.slice(0, -1) + CHARS[idx - 1];
  }
  // 最后一位已是最小字符，去掉末尾（更短的字符串字典序更小）
  if (input.length > 1) {
    return input.slice(0, -1);
  }
  // 单字符且已是最小，前缀补最小字符
  return CHARS[0] + CHARS[Math.floor(CHARS.length / 2)];
};

export const getMiddle = (a: string, b: string) => {

  let result = "";
  let i = 0;

  while (true) {
    const charA = i < a.length ? a[i] : "0"; // a 不够补最小
    const charB = i < b.length ? b[i] : "z"; // b 不够补最大

    const indexA = CHARS.indexOf(charA);
    const indexB = CHARS.indexOf(charB);

    // 找到可以插入的空间
    if (indexB - indexA > 1) {
      const midIndex = Math.floor((indexA + indexB) / 2);
      return result + CHARS[midIndex];
    }

    // 没空间，固定这一位，继续往后
    result += charA;
    i++;
  }
}