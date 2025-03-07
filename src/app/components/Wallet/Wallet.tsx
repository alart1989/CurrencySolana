'use client';

import { WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { FC, useMemo } from 'react';
import '@solana/wallet-adapter-react-ui/styles.css';


type Props = {
  children?: React.ReactNode;
};

export const Wallet: FC<Props> = ({ children }) => {

  // Получаем endpoint из .env
  const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_URL as string;

  const wallets = useMemo(
    () => [
    /*  new SolflareWalletAdapter(),
      new AlphaWalletAdapter(),
      new LedgerWalletAdapter(),*/
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={true}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};