"use client";

import styles from "./TokenSelector1.module.css";

const tokens = [
  { address: "So11111111111111111111111111111111111111112", logo: "/tokens/solana.png", symbol: "SOL" },
  { address: "TOKEN_ADDRESS_1", logo: "/tokens/usdc.png", symbol: "USDC" },
  { address: "TOKEN_ADDRESS_2", logo: "/tokens/usdt.png", symbol: "USDT" },
];

const TokenSelector1 = ({ selectedToken, onSelect }: { selectedToken: string; onSelect: (token: string) => void }) => {
  return (
    <div className={styles.tokenSelector}>
      <select className={styles.select} value={selectedToken} onChange={(e) => onSelect(e.target.value)}>
        {tokens.map((token) => (
          <option key={token.address} value={token.address}>
            {token.symbol}
          </option>
        ))}
      </select>
      <div className={styles.tokenLogoContainer}>
        <img
          src={tokens.find((t) => t.address === selectedToken)?.logo}
          alt="Token Logo"
          className={styles.tokenLogo}
        />
      </div>
    </div>
  );
};


export default TokenSelector1;
