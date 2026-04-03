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
  const lastChar = input[input.length - 1];
  const idx = CHARS.indexOf(lastChar);
  const step = Math.min(10, CHARS.length - 1 - idx);
  if (step > 0) {
    return input.slice(0, -1) + CHARS[idx + step];
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

export const getMiddle = (a: string, b: string): string => {
  if (a >= b) return a + CHARS[Math.floor(CHARS.length / 2)];

  let result = "";
  const maxLen = Math.max(a.length, b.length) + 8;

  for (let i = 0; i < maxLen; i++) {
    const charA = i < a.length ? a[i] : CHARS[0]; // a 不够补最小
    const charB = i < b.length ? b[i] : CHARS[CHARS.length - 1]; // b 不够补最大

    const indexA = CHARS.indexOf(charA);
    const indexB = CHARS.indexOf(charB);

    // 找到可以插入的空间
    if (indexB - indexA > 1) {
      const midIndex = Math.floor((indexA + indexB) / 2);
      return result + CHARS[midIndex];
    }

    // 没空间，固定这一位，继续往后
    result += charA;
  }

  // 兜底：追加中间字符
  return result + CHARS[Math.floor(CHARS.length / 2)];
}