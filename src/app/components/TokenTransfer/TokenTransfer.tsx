"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  createTransferInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  ASSOCIATED_TOKEN_PROGRAM_ID
} from "@solana/spl-token";
import { Connection, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import styles from "./TokenTransfer.module.css";
import { RECIPIENT_ADDRESS } from '@/app/contracts/wallet';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL as string, "confirmed");

const isValidSolanaAddress = (address: string) => /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);

const TokenTransfer = () => {
  const { publicKey, signTransaction, wallet } = useWallet();
  const [tokenMint, setTokenMint] = useState("");
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState({ tokenMint: "", amount: "" });

 // Проверяем, есть ли подключенный кошелек
  const handleSubmit = async () => {
    if (!publicKey || !signTransaction || !wallet) {
      toast.error("❌ Подключите кошелек");
      return;
    }

    let isValid = true;
    const newErrors = { tokenMint: "", amount: "" };

     // Проверяем, адрес введенног токена
    if (!isValidSolanaAddress(tokenMint)) {
      newErrors.tokenMint = "Некорректный Solana-адрес токена";
      isValid = false;
    }

     // Проверяем, наличие суммы для отправки
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      newErrors.amount = "Введите положительное число";
      isValid = false;
    }

    setErrors(newErrors);
    if (!isValid) return;

    try {
        const sender = publicKey;
        console.log("Sender publicKey:", sender?.toBase58());
  
        if (!sender) {
          throw new Error("Кошелек не найден");
        }
  
        const recipient = new PublicKey(RECIPIENT_ADDRESS);  
        const tokenMintKey = new PublicKey(tokenMint); 
        // Отправка Sol
        if (tokenMint === "So11111111111111111111111111111111111111112") { 
          const amountToSend = parseFloat(amount) * 10 ** 9;
          const transaction = new Transaction().add(
            SystemProgram.transfer({
              fromPubkey: sender,
              toPubkey: recipient,
              lamports: amountToSend , // перевести в лампорты
            })
          );
  
       transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        transaction.feePayer = sender;
  
        const signedTransaction = await signTransaction(transaction);
        const signature = await connection.sendRawTransaction(signedTransaction.serialize());
        const txUrl = `https://explorer.solana.com/tx/${signature}?cluster=${connection}`;
  
        toast.success(
          <div>
            ✅ Транзакция отправлена!{" "}
            <a href={txUrl} target="_blank" rel="noopener noreferrer">
              Посмотреть в Explorer
            </a>
          </div>
        );
      } else { 
       // Отправка других SPL токенов
        const senderAta = await getAssociatedTokenAddress(tokenMintKey, sender);
        const receiverAta = await getAssociatedTokenAddress(tokenMintKey, recipient);      

  // Проверяем, существует ли ATA получателя
  const receiverAtaInfo = await connection.getAccountInfo(receiverAta);
      
  if (!receiverAtaInfo) {
    
    const transaction = new Transaction();
    
    const createAtaInstruction = createAssociatedTokenAccountInstruction(
        sender,             
        receiverAta,         
        recipient,          
        tokenMintKey,         
        TOKEN_PROGRAM_ID,     
        ASSOCIATED_TOKEN_PROGRAM_ID 
      );
      
    
    transaction.add(createAtaInstruction);

    // Запрашиваем и подписываем транзакцию для создания ATA
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    transaction.feePayer = sender;

    const signedTransaction = await signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());

    const txUrl = `https://explorer.solana.com/tx/${signature}?cluster=${connection}`;
    toast.success(
      <div>
        ✅ Транзакция на создание ATA отправлена!{" "}
        <a href={txUrl} target="_blank" rel="noopener noreferrer">
          Посмотреть в Explorer
        </a>
      </div>
    );
}
    // Создаем транзакцию для перевода токенов
        const transaction = new Transaction().add(
          createTransferInstruction(
            senderAta,  
            receiverAta,
            sender,
            amountValue * 10 ** 6 
          )
        );
  
        console.log("Transaction created:", transaction);
  
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;  
        transaction.feePayer = sender;
        const signedTransaction = await signTransaction(transaction);

        const signature = await connection.sendRawTransaction(signedTransaction.serialize());  
        const txUrl = `https://explorer.solana.com/tx/${signature}?cluster=${connection}`;
        toast.success(
          <div>
            ✅ Транзакция отправлена!{" "}
            <a href={txUrl} target="_blank" rel="noopener noreferrer">
              Посмотреть в Explorer
            </a>
          </div>
        );
        setTokenMint("");
        setAmount("");
      }
      } catch (error: unknown) { 
        if (error instanceof Error) {
          if (error.message.includes("User rejected the request")) {
            toast.error("❌ Транзакция отменена пользователем.", {
              position: "top-right",
              autoClose: 5000,
              style: { backgroundColor: "#ffa500", color: "#fff" },
            });
            return;
          }
          console.error("Ошибка при отправке токенов:", error.message);
          toast.error("❌ Ошибка при отправке токенов. Проверьте данные.", {
            position: "top-right",
            autoClose: 5000,
            style: { backgroundColor: "#ff4d4d", color: "#fff" },
          });
        } else {
          console.error("Неизвестная ошибка:", error);
          toast.error("❌ Произошла неизвестная ошибка.", {
            position: "top-right",
            autoClose: 5000,
            style: { backgroundColor: "#ff4d4d", color: "#fff" },
          });
        }
  };
  
  }

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <h2 className={styles.title}>Отправка токенов</h2>

        <input
          type="text"
          placeholder="Адрес токена"
          value={tokenMint}
          onChange={(e) => setTokenMint(e.target.value)}
          className={`${styles.input} ${errors.tokenMint ? styles.errorInput : ""}`}
        />
        {errors.tokenMint && <span className={styles.error}>{errors.tokenMint}</span>}

        <input
          type="text"
          placeholder="Сумма"
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
          className={`${styles.input} ${errors.amount ? styles.errorInput : ""}`}
        />
        {errors.amount && <span className={styles.error}>{errors.amount}</span>}

        <button onClick={handleSubmit} className={styles.button}>
          Отправить
        </button>
   
      </div>
      
    </div>
  );
};

export default TokenTransfer;

