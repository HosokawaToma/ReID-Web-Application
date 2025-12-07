"use client";

import PersonFlowWeight from "@/components/PersonFlowWeight";
import styles from "./page.module.css";

export default function PersonFlowPage() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Person Flow Graph</h1>
      <PersonFlowWeight />
    </main>
  );
}
