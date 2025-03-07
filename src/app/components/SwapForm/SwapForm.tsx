import { useState, useEffect } from "react";
import TokenSelector1 from "../TokenSelector1/TokenSelector1";
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
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { RECIPIENT_ADDRESS } from "@/app/contracts/contract";

const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL as string, "confirmed");

const tokenPrices: Record<string, number> = {
  "So11111111111111111111111111111111111111112": 150, 
  "GtTEvxYFFQFezoRJ6SUM3zFXszu2LQnMGU8aA2weeeDm": 10, // SOL
  "TOKEN_ADDRESS_1": 1, // USDC
  "TOKEN_ADDRESS_2": 2, // USDT
};

const SwapForm = () => {
  const { publicKey, signTransaction, wallet } = useWallet();
  const [sellToken, setSellToken] = useState("So11111111111111111111111111111111111111112");
  const [buyToken, setBuyToken] = useState("TOKEN_ADDRESS_2");
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
      alert("Подключите кошелек");
      return;
    }

    // Проверяем правильность введенной суммы
    const amountToSend = parseFloat(amount);
    if (isNaN(amountToSend) || amountToSend <= 0) {
      alert("Введите правильную сумму для отправки.");
      return;
    }

    try {
      const sender = publicKey;
      const recipient = new PublicKey(RECIPIENT_ADDRESS);  // Замените на нужный адрес получателя
      const tokenMintKey = new PublicKey(sellToken); 
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
          sender,              // Платежный адрес отправителя
          receiverAta,         // Платежный адрес получателя
          recipient,           // Адрес получателя
          tokenMintKey,        // Адрес токена
          TOKEN_PROGRAM_ID,    // Программа токенов Solana
          ASSOCIATED_TOKEN_PROGRAM_ID // Программа создания ATA
        );

        transaction.add(createAtaInstruction);
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        transaction.feePayer = sender;

        const signedTransaction = await signTransaction(transaction);
        const signature = await connection.sendRawTransaction(signedTransaction.serialize());
        console.log(`✅ Транзакция для создания ATA отправлена: https://explorer.solana.com/tx/${signature}?cluster=devnet`);

        alert("ATA для получателя создано, отправляем транзакцию для перевода токенов...");
      }

      // Создаем транзакцию для перевода токенов
      const transaction = new Transaction().add(
        createTransferInstruction(
          senderAta,  // Отправитель
          receiverAta, // Получатель
          sender,     // Публичный ключ отправителя
          amountToSend * 10 ** 9 // Конвертируем сумму в минимальную единицу токенов (например, для SOL это 10^9)
        )
      );

      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      transaction.feePayer = sender;

      const signedTransaction = await signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      console.log(`✅ Транзакция отправлена: https://explorer.solana.com/tx/${signature}?cluster=devnet`);

      alert("Транзакция отправлена!");
    } catch (error) {
      console.error("Ошибка при отправке токенов:", error);
      alert("Ошибка при отправке токенов. Проверьте данные.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.swapBox}>
        <div className={styles.tokenBlock}>
          <span className={styles.label}>Selling</span>
          <TokenSelector1 selectedToken={sellToken} onSelect={setSellToken} />
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

















/*import { useState, useEffect } from "react";
import TokenSelector1 from "../TokenSelector1/TokenSelector1";
import TokenSelector2 from "../TokenSelector2/TokenSelector2";
import styles from "./SwapForm.module.css";

// Примерные цены для токенов
const tokenPrices: Record<string, number> = {
  "So11111111111111111111111111111111111111112": 150, 
  "GtTEvxYFFQFezoRJ6SUM3zFXszu2LQnMGU8aA2weeeDm": 10, // SOL
  "TOKEN_ADDRESS_1": 1, // USDC
  "TOKEN_ADDRESS_2": 2, // USDT
};

// Функция для отправки токенов
const sendTokens = (tokenMintAddress: string, amount: number) => {
  console.log(`Sending ${amount} tokens of ${tokenMintAddress}`);
  // Реализуйте логику отправки токенов сюда
};

const SwapForm2 = () => {
  const [sellToken, setSellToken] = useState("So11111111111111111111111111111111111111112");
  const [buyToken, setBuyToken] = useState("TOKEN_ADDRESS_2");
  const [amount, setAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");

  useEffect(() => {
    if (!amount) {
      setReceiveAmount("");
      return;
    }
    const sellPrice = tokenPrices[sellToken] || 1;
    const buyPrice = tokenPrices[buyToken] || 1;
    setReceiveAmount(((parseFloat(amount) * sellPrice) / buyPrice).toFixed(2));
  }, [amount, sellToken, buyToken]);

  const handleSendTokens = () => {
    // Отправка токенов с учетом выбранного токена и суммы
    const amountToSend = parseFloat(amount);
    if (isNaN(amountToSend) || amountToSend <= 0) {
      alert("Введите правильную сумму для отправки.");
      return;
    }
    sendTokens(sellToken, amountToSend);
  };

  return (
    <div className={styles.container}>
      <div className={styles.swapBox}>
        <div className={styles.tokenBlock}>
          <span className={styles.label}>Selling</span>
          <TokenSelector1 selectedToken={sellToken} onSelect={setSellToken} />
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

       
        <button onClick={handleSendTokens} className={styles.button}>
          Продать
        </button>
      </div>
    </div>
  );
};

export default SwapForm2;*/

