"use client";

import LoginForm from "@/components/auth/LoginForm";
import { useTokenContext } from "./context/TokenContext";
import styles from "./styles.module.css";

export default function Home() {
  const { setToken } = useTokenContext();
  return (
    <main>
      <div className={styles.fullscreenPageContainer}>
        <div style={{ width: "500px", height: "500px" }}>
          <LoginForm setToken={setToken}/>
        </div>
      </div>
    </main>
  );
}
