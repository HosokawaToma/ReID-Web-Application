"use client";

import styles from "@/components/auth/LoginForm.module.css";
import { ApiV1 } from "@/lib/api/v1";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm({ api }: { api: ApiV1 }) {
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement & { id: HTMLInputElement; password: HTMLInputElement };
    const id = form.id.value;
    const password = form.password.value;
    api.login(id, password)
      .then(() => {
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
