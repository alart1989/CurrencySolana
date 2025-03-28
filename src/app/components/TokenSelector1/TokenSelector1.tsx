import Image from "next/image";
import styles from "./TokenSelector1.module.css";


// Типизация для токенов
interface Token {
  address: string;
  logo: string;
  symbol: string;
}

interface TokenSelectorProps {
  selectedToken: string;
  onSelect: (token: string) => void;
}

const tokens: Token[] = [
  { address: "So11111111111111111111111111111111111111112", logo: "/tokens/solana.png", symbol: "SOL" },
  { address: "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN", logo: "/tokens/TRUMP.png", symbol: "TRUMP" },
  { address: "xxxxa1sKNGwFtw2kFn8XauW9xq8hBZ5kVtcSesTT9fW", logo: "/tokens/SLIM.png", symbol: "BANAN" },
  { address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", logo: "/tokens/usdt.png", symbol: "USDT" },
];

const TokenSelector1: React.FC<TokenSelectorProps> = ({ selectedToken, onSelect }) => {
  const selectedTokenInfo = tokens.find((t) => t.address === selectedToken);

  return (
    <div className={styles.tokenSelector}>
      <select
        className={styles.select}
        value={selectedToken}
        onChange={(e) => onSelect(e.target.value)}
      >
        {tokens.map((token) => (
          <option key={token.address} value={token.address}>
            {token.symbol}
          </option>
        ))}
      </select>

      {selectedTokenInfo && (
        <div className={styles.tokenLogoContainer}>
          <Image
            src={selectedTokenInfo.logo}
            alt={`Logo of ${selectedTokenInfo.symbol}`}
            className={styles.tokenLogo}
            width={40} // Установите соответствующие размеры для логотипа
            height={40}
          />
        </div>
      )}
    </div>
  );
};

export default TokenSelector1;

