'use client';

import styles from "./page.module.css";
import Send from "./Send/page";
import Swap from "./Swap/page";


    export default function Home() {
      return (
        <main className={styles.container}>
          <div className={styles.section}>
            <Send />
          </div>
          <div className={styles.section}>
            <Swap />
          </div>
        </main>
      );
    }
  