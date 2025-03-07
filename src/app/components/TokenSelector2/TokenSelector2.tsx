import Image from "next/image";
import styles from "./TokenSelector2.module.css";

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
 
  { address: "TOKEN_ADDRESS_1", logo: "/tokens/usdc.png", symbol: "USDC" },
  { address: "TOKEN_ADDRESS_2", logo: "/tokens/usdt.png", symbol: "USDT" },
];

const TokenSelector2: React.FC<TokenSelectorProps> = ({ selectedToken, onSelect }) => {
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


export default TokenSelector2;
