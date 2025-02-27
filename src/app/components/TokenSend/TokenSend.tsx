'use client';

import { useState } from 'react';
import styles from './TokenSend.module.css';

const isValidSolanaAddress = (address: string) => {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
};

const TokenSend = ({ onSubmit }: { onSubmit: (tokenAddress: string, amount: number) => void }) => {
  const [tokenAddress, setTokenAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState({ tokenAddress: '', amount: '' });

  const handleSubmit = () => {
    let isValid = true;
    const newErrors = { tokenAddress: '', amount: '' };

    if (!isValidSolanaAddress(tokenAddress)) {
      newErrors.tokenAddress = 'Некорректный Solana-адрес';
      isValid = false;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      newErrors.amount = 'Введите положительное число';
      isValid = false;
    }

    setErrors(newErrors);
    
    if (isValid) {
      onSubmit(tokenAddress, amountValue);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <input
          type="text"
          placeholder="Адрес токена"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          className={`${styles.input} ${errors.tokenAddress ? styles.errorInput : ''}`}
        />
        {errors.tokenAddress && <span className={styles.error}>{errors.tokenAddress}</span>}

        <input
          type="text" // Изменено с "number", чтобы скрыть стрелки
          placeholder="Сумма"
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))} // Разрешает только числа и точку
          className={`${styles.input} ${errors.amount ? styles.errorInput : ''}`}
        />
        {errors.amount && <span className={styles.error}>{errors.amount}</span>}

        <button onClick={handleSubmit} className={styles.button}>
          Отправить
        </button>
      </div>
    </div>
  );
};

export default TokenSend;










/*# env files (can opt-in for committing if needed)
.env*
*/