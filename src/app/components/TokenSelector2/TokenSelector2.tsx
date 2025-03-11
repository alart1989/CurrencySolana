import { useState } from "react";
import Image from "next/image";
import styles from "./TokenSelector2.module.css";
import { toast } from "react-toastify";

interface Token {
  address: string;
  logo: string;
  symbol: string;
  fullName: string;
}

interface TokenSelectorProps {
  selectedToken: string;
  onSelect: (token: string) => void;
}

const tokens: Token[] = [
  {
    address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    logo: "/tokens/usdt.png",
    symbol: "USDT",
    fullName: "Tether USD",
  },
  {
    address: "So11111111111111111111111111111111111111112",
    logo: "/tokens/solana.png",
    symbol: "SOL",
    fullName: "Solana",
  },
  {
    address: "xxxxa1sKNGwFtw2kFn8XauW9xq8hBZ5kVtcSesTT9fW",
    logo: "/tokens/SLIM.png",
    symbol: "SLIM",
    fullName: "Solanium",
  },
  {  
    address: "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN",
    logo: "/tokens/TRUMP.png",
    symbol: "TRUMP",
    fullName: "OFFICIAL TRUMP",
  },
];

const TokenSelector2: React.FC<TokenSelectorProps> = ({
  selectedToken,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedTokenInfo = tokens.find((t) => t.address === selectedToken);

  // Функция копирования в буфер
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Адрес токена скопирован!");
  };

  return (
    <div className={styles.tokenSelector}>
      {/* Кнопка выбора токена */}
      <button className={styles.select} onClick={() => setIsOpen(!isOpen)}>
        {selectedTokenInfo ? (
          <>
            <Image
              src={selectedTokenInfo.logo}
              alt={selectedTokenInfo.symbol}
              width={24}
              height={24}
              className={styles.tokenLogo}
            />
            {selectedTokenInfo.symbol}
          </>
        ) : (
          "Выбрать токен"
        )}
      </button>

      {/* Выпадающий список */}
      {isOpen && (
        <div className={styles.dropdown}>
          {tokens.map((token) => (
            <div
              key={token.address}
              className={styles.tokenOption}
              onClick={() => {
                onSelect(token.address);
                setIsOpen(false);
              }}
            >
              <Image
                src={token.logo}
                alt={token.symbol}
                width={24}
                height={24}
                className={styles.tokenLogo}
              />
              <div className={styles.tokenInfo}>
                <span className={styles.tokenSymbol}>{token.symbol}</span>
                <span className={styles.tokenFullName}>{token.fullName}</span>
                <span
                  className={styles.tokenAddress}
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(token.address);
                  }}
                >
                  {token.address.slice(0, 6)}...{token.address.slice(-6)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TokenSelector2;
