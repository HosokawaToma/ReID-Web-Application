"use client";

import { ApiV1AdminAuthLogin } from "@/lib/api/v1/adminAuthLogin";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "../styles/index.module.css";

interface LoginFormProps {
  setToken: (token: string | null) => void;
}

export default function LoginForm({ setToken }: LoginFormProps) {
  const [errorMessage, setErrorMessage] = useState<string>("test");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement & { id: HTMLInputElement; password: HTMLInputElement };
    const id = form.id.value;
    const password = form.password.value;
    ApiV1AdminAuthLogin(id, password)
      .then((token: string) => {
        setToken(token);
        setErrorMessage("");
        router.push("/dashboard");
      })
      .catch((error: Error) => {
        setErrorMessage(error.message);
      });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className={styles.defaultFormContainer}>
        <p className={styles.errorMessage}>
          {errorMessage}
        </p>
        <input
          id="id"
          name="id"
          type="text"
          autoComplete="id"
          placeholder="ID"
          required
          autoFocus
          className={styles.defaultInput}
        />
        <span className={styles.RequiredErrorMessageSpan}>このフィールドは必須です。</span>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Password"
          required
          className={styles.defaultInput}
        />
        <span className={styles.RequiredErrorMessageSpan}>このフィールドは必須です。</span>
        <button type="submit" className={styles.primaryButton}>
          ログイン
        </button>
      </div>
    </form>
  );
}
