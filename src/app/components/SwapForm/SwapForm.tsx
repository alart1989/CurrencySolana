"use client";

import { useState, useEffect } from "react";
import TokenSelector1 from "../TokenSelector1/TokenSelector1";
import TokenSelector2 from "../TokenSelector2/TokenSelector2";
import styles from "./SwapForm.module.css";

const tokenPrices: Record<string, number> = {
  "So11111111111111111111111111111111111111112": 150, // SOL
  "TOKEN_ADDRESS_1": 1, // USDC
  "TOKEN_ADDRESS_2": 1, // USDT
};

const SwapForm = () => {
  const [sellToken, setSellToken] = useState("So11111111111111111111111111111111111111112");
  const [buyToken, setBuyToken] = useState("TOKEN_ADDRESS_2");
  const [amount, setAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [isSelling, setIsSelling] = useState(true); // true - SELLER сверху, false - BUYER сверху

  useEffect(() => {
    if (!amount) {
      setReceiveAmount("");
      return;
    }
    const sellPrice = tokenPrices[sellToken] || 1;
    const buyPrice = tokenPrices[buyToken] || 1;
    setReceiveAmount(((parseFloat(amount) * sellPrice) / buyPrice).toFixed(2));
  }, [amount, sellToken, buyToken]);

  const handleSwap = () => {
    setSellToken(buyToken);
    setBuyToken(sellToken);
    setIsSelling((prev) => !prev);
  };

  return (
    <div className={styles.container}>
      <div className={styles.swapBox}>
        {/* Верхний блок (Seller или Buyer) */}
        <div className={styles.tokenBlock}>
          <span className={styles.label}>{isSelling ? "Selling" : "Buying"}</span>
          <TokenSelector1 selectedToken={isSelling ? sellToken : buyToken} onSelect={isSelling ? setSellToken : setBuyToken} />
          <input
            type="text"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
            className={styles.input}
          />
        </div>

        {/* Кнопка смены блоков */}
        <button onClick={handleSwap} className={styles.swapButton}>⇅</button>

        {/* Нижний блок (Buyer или Seller) */}
        <div className={styles.tokenBlock}>
          <span className={styles.label}>{isSelling ? "Buying" : "Selling"}</span>
          <TokenSelector2 selectedToken={isSelling ? buyToken : sellToken} onSelect={isSelling ? setBuyToken : setSellToken} />
          <input
            type="text"
            value={receiveAmount}
            readOnly
            className={styles.input}
          />
        </div>
      </div>
    </div>
  );
};

export default SwapForm;






