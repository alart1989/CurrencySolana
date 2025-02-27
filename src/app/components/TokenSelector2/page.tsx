"use client";

import styles from "./TokenSelector2.module.css";

const tokens = [
  { address: "So11111111111111111111111111111111111111112", name: "SOL", logo: "/tokens/solana.png" },
  { address: "TOKEN_ADDRESS_1", name: "USDC", logo: "/tokens/usdc.png" },
  { address: "TOKEN_ADDRESS_2", name: "USDT", logo: "/tokens/usdt.png" },
];

const TokenSelector2 = ({ onSelect }: { onSelect?: (token: string) => void }) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Selling</h3>
      <div className={styles.tokenGrid}>
        {tokens.map((token) => (
          <button key={token.address} onClick={() => onSelect?.(token.address)} className={styles.tokenButton}>
            <img src={token.logo} className={styles.tokenImage} alt={token.name} />
            <span className={styles.tokenName}>{token.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TokenSelector2;
