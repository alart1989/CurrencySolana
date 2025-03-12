import { useState, useEffect } from "react";
import TokenSelector2 from "../TokenSelector2/TokenSelector2";
import styles from "./SwapForm.module.css";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { Connection, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { RECIPIENT_ADDRESS } from "@/app/contracts/wallet";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL as string, "confirmed");

// Добавляем цены токенов для работы калькулятора 
const tokenPrices: Record<string, number> = {
  "So11111111111111111111111111111111111111112": 120, // Sol
  "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN": 10, // TRUMP
  "xxxxa1sKNGwFtw2kFn8XauW9xq8hBZ5kVtcSesTT9fW": 0.05, // SLIM
  "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB": 1, // USDT
};

const SwapForm = () => {
  const { publicKey, signTransaction, wallet } = useWallet();
  const [sellToken, setSellToken] = useState("So11111111111111111111111111111111111111112");
  const [buyToken, setBuyToken] = useState("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB");
  const [amount, setAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");

  // Пересчитываем receiveAmount каждый раз, когда меняется amount, sellToken или buyToken
  useEffect(() => {
    if (!amount) {
      setReceiveAmount("");
      return;
    }
    const sellPrice = tokenPrices[sellToken] || 1;
    const buyPrice = tokenPrices[buyToken] || 1;
    setReceiveAmount(((parseFloat(amount) * sellPrice) / buyPrice).toFixed(2));
  }, [amount, sellToken, buyToken]);

  const handleSendTokens = async () => {
    // Проверяем, есть ли подключенный кошелек
    if (!publicKey || !signTransaction || !wallet) {
      toast.error("❌ Подключите кошелек");
      return;
    }

    // Проверяем правильность введенной суммы
    const amountToSend = parseFloat(amount);
    if (isNaN(amountToSend) || amountToSend <= 0) {
      toast.error("❌Введите правильную сумму для отправки.");
      return;
    }

    try {
      const sender = publicKey;
      const recipient = new PublicKey(RECIPIENT_ADDRESS); 
      const tokenMintKey = new PublicKey(sellToken); 


    // Отправка Sol
      if (sellToken === "So11111111111111111111111111111111111111112") {  
        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: sender,
            toPubkey: recipient,
            lamports: amountToSend * 10 ** 9, // перевести в лампорты
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
   console.log("Баланс отправителя:", senderAta);

   const senderBalance = await connection.getTokenAccountBalance(senderAta);
   console.log("Баланс отправителя:", senderBalance);

   if (!senderBalance.value || parseFloat(senderBalance.value.amount) < amountToSend) {
     alert("Недостаточно токенов на кошельке");
     return;
   }
   
      const receiverAta = await getAssociatedTokenAddress(tokenMintKey, recipient);
 // если необходимо то создаем ATA
if (!senderBalance.value) {
  console.log("ATA не существует!");
}

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
        )
       }

      // Создаем транзакцию для перевода токенов
      const transaction = new Transaction().add(
        createTransferInstruction(
          senderAta, 
          receiverAta, 
          sender,     
          amountToSend * 10 ** 6 
        )
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
      
      setAmount("");
    }
    } catch (error) {
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
      <div className={styles.swapBox}>
        <div className={styles.tokenBlock}>
          <span className={styles.label}>Selling</span>
          <TokenSelector2 selectedToken={sellToken} onSelect={setSellToken} />
          <input
            type="text"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
            className={styles.input}
          />
        </div>

        <div className={styles.tokenBlock}>
          <TokenSelector2 selectedToken={buyToken} onSelect={setBuyToken} />
          <p className={styles.input}>Вы получите {receiveAmount}</p>
        </div>

        {/* Кнопка для отправки токенов */}
        <button onClick={handleSendTokens} className={styles.button}>
          Продать
        </button>
      </div>
    </div>
  );
};

export default SwapForm;

