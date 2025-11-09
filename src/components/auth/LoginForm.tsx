"use client";

import styles from "@/components/auth/LoginForm.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("IDまたはパスワードが正しくありません。");
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    if (!form.checkValidity()) {
      return;
    }

    fetch(new Request(
      new URL("/api/v1/login/admin_client", process.env.NEXT_PUBLIC_API_URL as string),
      {
        method: "POST",
        body: JSON.stringify({ admin_client_id: id, password }),
      }
    )).then((response) => {
      if (response.status === 200) {
        router.push("/dashboard");
      }
      setErrorMessage("IDまたはパスワードが正しくありません。");
      setError(true);
    }).catch(() => {
      setErrorMessage("内部エラーが発生しました。管理者にお問い合わせください。");
      setError(true);
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.defaultForm} noValidate>
      <p style={{ opacity: error ? 1 : 0, color: "var(--error-color)", transition: "opacity 0.3s ease-in-out" }}>
        {errorMessage}
      </p>
      <input
        id="id"
        name="id"
        type="id"
        autoComplete="id"
        placeholder="ID"
        required
        autoFocus
        value={id}
        onChange={(e) => setId(e.target.value)}
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
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={styles.defaultInput}
      />
      <span className={styles.RequiredErrorMessageSpan}>このフィールドは必須です。</span>
      <button type="submit" className={styles.defaultButton}>
        ログイン
      </button>
    </form>
  );
}
