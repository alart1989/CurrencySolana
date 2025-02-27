import { PublicKey } from "@solana/web3.js";

// Функция проверки валидности токена
export const isValidTokenAddress = (address: string): boolean => {
  try {
    new PublicKey(address);
    return true;
  } catch (error) {
    return false;
  }
};

// Функция перевода токена в Lamports (1 SOL = 1_000_000_000 Lamports)
export const toLamports = (amount: number): number => {
  return Math.floor(amount * 1_000_000_000);
};

// Функция перевода Lamports в SOL
export const fromLamports = (amount: number): number => {
  return amount / 1_000_000_000;
};
