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
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
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


  const handleSubmit = async () => {
    if (!publicKey || !signTransaction || !wallet) {
      alert("Подключите кошелек");
      return;
    }

    let isValid = true;
    const newErrors = { tokenMint: "", amount: "" };

    if (!isValidSolanaAddress(tokenMint)) {
      newErrors.tokenMint = "Некорректный Solana-адрес токена";
      isValid = false;
    }

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
        const senderAta = await getAssociatedTokenAddress(tokenMintKey, sender);
        const receiverAta = await getAssociatedTokenAddress(tokenMintKey, recipient);

        
        const senderBalance = await connection.getTokenAccountBalance(senderAta);
        console.log("Sender Balance:", senderBalance);
        

  // Проверяем, существует ли ATA получателя
  const receiverAtaInfo = await connection.getAccountInfo(receiverAta);
      
  if (!receiverAtaInfo) {
    console.log("ATA для получателя не существует, создаем...");
    
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

    const txUrl = `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
    toast.success(
      <div>
        ✅ Транзакция на создание ATA отправлена!{" "}
        <a href={txUrl} target="_blank" rel="noopener noreferrer">
          Посмотреть в Explorer
        </a>
      </div>
    );
}

        const transaction = new Transaction().add(
          createTransferInstruction(
            senderAta,  
            receiverAta,
            sender,
            amountValue * 10 ** 9 
          )
        );
  
        console.log("Transaction created:", transaction);
  
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        console.log("Recent Blockhash:", transaction.recentBlockhash);
  
        transaction.feePayer = sender;
        console.log("Transaction Fee Payer:", transaction.feePayer);
  
        const signedTransaction = await signTransaction(transaction);
        console.log("Signed Transaction:", signedTransaction);
  
        const signature = await connection.sendRawTransaction(signedTransaction.serialize());
       // console.log(`✅ Транзакция отправлена: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
  
        const txUrl = `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
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

      } catch (error: any) {  
        const errorMessage = error instanceof Error ? error.message : String(error);
      if (error.message.includes("User rejected the request")) {
        toast.error("❌ Транзакция отменена пользователем.", {
          position: "top-right",
          autoClose: 5000,
          style: { backgroundColor: "#ffa500", color: "#fff" },
        });
        return;
        
      } 
      console.error("Ошибка при отправке токенов:", error);
      toast.error("❌ Ошибка при отправке токенов. Проверьте данные.", {
        position: "top-right",
        autoClose: 5000,
        style: { backgroundColor: "#ff4d4d", color: "#fff" },
        });
      
    }
  };
  


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

