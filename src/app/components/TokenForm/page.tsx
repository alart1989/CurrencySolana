'use client';

import { useState } from 'react';
import { sendTokensToContract } from '@/app/lib/solana';// Импорт функции для отправки токенов
// import { contractAddress } from '@/app/contracts/contract'; // Импорт адреса контракта
import { useWallet } from '@solana/wallet-adapter-react';
import styles from './TokenForm.module.css';

const isValidSolanaAddress = (address: string) => {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
};

const TokenForm = () => {
  const { publicKey, sendTransaction } = useWallet();
  const [tokenAddress, setTokenAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState({ tokenAddress: '', amount: '' });

  const handleSubmit = async () => {
    if (!publicKey) {
      alert('Подключите кошелек');
      return;
    }

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
      try {
        await sendTokensToContract(tokenAddress, amountValue, publicKey, sendTransaction);
        alert('Транзакция отправлена');
      } catch (error) {
        console.error('Ошибка при отправке токенов:', error);
        alert('Ошибка при отправке токенов');
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
      <h2 className={styles.title}>Отправка токенов</h2>
        <input
          type="text"
          placeholder="Адрес токена"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          className={`${styles.input} ${errors.tokenAddress ? styles.errorInput : ''}`}
        />
        {errors.tokenAddress && <span className={styles.error}>{errors.tokenAddress}</span>}

        <input
          type="text"
          placeholder="Сумма"
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
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

export default TokenForm;


