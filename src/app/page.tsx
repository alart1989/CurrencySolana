'use client';

import styles from "./page.module.css";
import Send from "./Send/page";
import Swap from "./Swap/page";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



    export default function Home() {
      return (
        <main className={styles.container}>
          <div className={styles.section}>
            <Send />
          </div>
          <div className={styles.section}>
            <Swap />
          </div>
             {/* Контейнер для уведомлений */}
    <ToastContainer position="top-right" autoClose={5000} />
        </main>
      );
    }
  