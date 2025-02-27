'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useWallet } from '@solana/wallet-adapter-react';
import styles from "./NavBar.module.css";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

const NavBar = () => {
  
  const { publicKey, disconnect } = useWallet();

  return (
    <div className={styles.navbar}>
    <div>
      <h3 className={styles.title}>Solana Swap</h3>
    </div>
    <div className={styles.walletButton}>
    <WalletMultiButtonDynamic>
          {publicKey
            ? ${publicKey.toBase58().substring(0, 7)}...
            : 'Connect Wallet'}
        </WalletMultiButtonDynamic>
        {publicKey && (
          <button className={styles.disconnectButton} onClick={disconnect}>
            Отключиться
          </button>
        )}
    </div>
  </div>
  );
};

export default NavBar;
