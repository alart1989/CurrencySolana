"use client";

import { useState } from "react";
import styles from "./TokenSelector.module.css";

const tokens = [
  { address: "So11111111111111111111111111111111111111112", logo: "/tokens/solana.png" },
  { address: "TOKEN_ADDRESS_1",  logo: "/tokens/usdc.png" },
  { address: "TOKEN_ADDRESS_2",  logo: "/tokens/usdt.png" },
];

const TokenSelector = ({ onSelect }: { onSelect?: (token: string) => void }) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Выберите токен</h2>
      <div className={styles.tokenGrid}>
        {tokens.map((token) => (
          <button
            key={token.address}
            onClick={() => onSelect?.(token.address)}
            className={styles.tokenButton}
          >
            <img src={token.logo} className={styles.tokenImage} />
            <span className={styles.tokenName}></span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TokenSelector;