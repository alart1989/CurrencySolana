'use client';

import Image from "next/image";
import styles from "./page.module.css";
import TokenSelector from "./components/TokenSelector/page";
import Send from "./Send/page";
import Swap2 from "./Swap2/page";



    export default function Home() {
      return (
        <main className={styles.container}>
          <div className={styles.section}>
            <Send />
          </div>
          <div className={styles.section}>
            <Swap2 />
          </div>
        </main>
      );
    }
  




  //   <TokenSelector onSelect={(token) => console.log("Выбран токен:", token)}/>