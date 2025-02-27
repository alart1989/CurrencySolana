import {
    Connection,
    PublicKey,
    Transaction,
  } from '@solana/web3.js';
  import {
    createTransferInstruction,
    getAssociatedTokenAddress  
  } from '@solana/spl-token';
  import { contractAddress } from '@/app/contracts/contract';
  
  export const sendTokensToContract = async (
    tokenMintAddress: string, // Адрес токена
    amount: number,
    senderPublicKey: PublicKey,
    sendTransaction: (transaction: Transaction, connection: Connection) => Promise<string>
  ) => {
    const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL!, 'confirmed');
    const mint = new PublicKey(tokenMintAddress);
    const senderATA = await getAssociatedTokenAddress(mint, senderPublicKey);
    const receiverATA = await getAssociatedTokenAddress(mint, new PublicKey(contractAddress));
  
    // Создаем инструкцию перевода
    const transferInstruction = createTransferInstruction(
      senderATA,       // Откуда (ATA отправителя)
      receiverATA,     // Куда (ATA контракта)
      senderPublicKey, // Кто отправляет
      amount * 10 ** 9 // Количество токенов (предполагаем, что 6 знаков после запятой)
    );
  
    // Создаем и подписываем транзакцию
    const transaction = new Transaction().add(transferInstruction);
    const signature = await sendTransaction(transaction, connection);
  
    console.log(`Транзакция отправлена: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
  };
  










/*import { Connection } from "@solana/web3.js";

const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_URL as string;
export const connection = new Connection(endpoint, "confirmed");*/


// https://api.mainnet-beta.solana.com
