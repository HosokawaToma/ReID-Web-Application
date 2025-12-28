"use client";

import styles from "@/components/auth/LoginForm.module.css";
import { ApiV1AdminAuthLogin } from "@/lib/api/v1/adminAuthLogin";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface LoginFormProps {
  setToken: (token: string | null) => void;
}

export default function LoginForm({ setToken }: LoginFormProps) {
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement & { id: HTMLInputElement; password: HTMLInputElement };
    const id = form.id.value;
    const password = form.password.value;
    ApiV1AdminAuthLogin(id, password)
      .then((token: string) => {
        setToken(token);
        setError(false);
        setErrorMessage("");
        router.push("/dashboard");
      })
      .catch((error: Error) => {
        setError(true);
        setErrorMessage(error.message);
      });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.defaultForm} noValidate>
      <p
        style={{
          opacity: error ? 1 : 0,
          color: "var(--error-color)",
          transition: "opacity 0.3s ease-in-out",
        }}>
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
      <button type="submit" className={styles.defaultButton}>
        ログイン
      </button>
    </form>
  );
}
