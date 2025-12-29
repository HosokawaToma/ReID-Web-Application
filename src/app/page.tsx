"use client";

import LoginForm from "@/components/login/form";
import { useTokenContext } from "./context/TokenContext";

export default function Home() {
  const { setToken } = useTokenContext();
  return (
    <div style={{ width: "500px", height: "500px" }}>
      <LoginForm setToken={setToken}/>
    </div>
  );
}
