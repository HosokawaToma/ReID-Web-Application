"use client";

import PersonFlowWeight from "@/components/personFlowWeight";
import { useTokenContext } from "../context/TokenContext";

export default function PersonFlowWeightPage() {
  const { token } = useTokenContext();
  return (
    <PersonFlowWeight token={token} />
  );
}
